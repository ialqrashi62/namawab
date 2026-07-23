# MICU — Routes & API

## Middleware Chain
```js
const requireAuth = require('../middleware/requireAuth');
const requireTenantScope = require('../middleware/requireTenantScope');
const requireRole = require('../middleware/requireRole');
const validateBody = require('../middleware/validateBody');
const idempotencyGuard = require('../middleware/idempotency');
const auditMiddleware = require('../middleware/audit_middleware');

const RS = require('../route_schemas');
```

## Routes

```js
// GET /api/micu/admissions
router.get('/micu/admissions',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse', 'admin']),
  async (req, res) => {
    const admissions = await db.query(`
      SELECT a.*, p.full_name, p.mrn, a.apache_ii_score, a.sofa_score, a.code_status
      FROM icu_admissions a
      JOIN patients p ON p.id = a.patient_id
      WHERE a.tenant_id = $1 AND a.discharged_at IS NULL
      ORDER BY a.admitted_at DESC
    `, [req.tenantId]);
    res.json(admissions.rows);
  }
);

// GET /api/micu/admissions/:id
router.get('/micu/admissions/:id',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse', 'admin']),
  async (req, res) => {
    const admission = await db.query(`
      SELECT a.*, p.full_name, p.mrn, p.dob, p.allergies,
             u.full_name AS admitting_md
      FROM icu_admissions a
      JOIN patients p ON p.id = a.patient_id
      LEFT JOIN users u ON u.id = a.admitting_md_id
      WHERE a.tenant_id = $1 AND a.id = $2
    `, [req.tenantId, req.params.id]);
    if (admission.rowCount === 0) return res.status(404).json({ error: 'Admission not found' });
    res.json(admission.rows[0]);
  }
);

// POST /api/micu/admissions
router.post('/micu/admissions',
  requireAuth, requireTenantScope, requireRole(['doctor', 'admin']),
  validateBody(RS.icu_admission_create),
  auditMiddleware('icu_admission_create'),
  async (req, res) => {
    const result = await db.query(`
      INSERT INTO icu_admissions (
        tenant_id, encounter_id, patient_id, admitted_at,
        primary_diagnosis, admitting_md_id, code_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [req.tenantId, req.body.encounterId, req.body.patientId, req.body.admittedAt,
        req.body.primaryDiagnosis, req.body.admittingMdId, req.body.codeStatus || 'FULL']);
    res.status(201).json(result.rows[0]);
  }
);

// POST /api/micu/admissions/:id/vitals
router.post('/micu/admissions/:id/vitals',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']),
  validateBody(RS.icu_vital_create),
  auditMiddleware('icu_vital_create'),
  async (req, res) => {
    const result = await db.query(`
      INSERT INTO icu_vitals (
        tenant_id, admission_id, recorded_at, heart_rate,
        systolic_bp, diastolic_bp, map, respiratory_rate,
        spo2, temperature_c, gcs_total, urine_output_ml
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [req.tenantId, req.params.id, req.body.recordedAt, req.body.heartRate,
        req.body.systolicBp, req.body.diastolicBp, req.body.map,
        req.body.respiratoryRate, req.body.spo2, req.body.temperatureC,
        req.body.gcsTotal, req.body.urineOutputMl]);

    // Trigger AI early warning if abnormal
    const score = calculateQSOFA(req.body);
    if (score.highRisk) {
      await triggerAlert('QSOFA_HIGH', req.params.id, req.tenantId);
    }
    res.status(201).json(result.rows[0]);
  }
);

// POST /api/micu/admissions/:id/scores
router.post('/micu/admissions/:id/scores',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']),
  validateBody(RS.score_calculate),
  async (req, res) => {
    let calculated;
    if (req.body.scoreType === 'SOFA') {
      calculated = calculateSOFA(req.body.subscores);
    } else if (req.body.scoreType === 'GCS') {
      calculated = calculateGCS(req.body.subscores.eye, req.body.subscores.verbal, req.body.subscores.motor);
    } else if (req.body.scoreType === 'CAM_ICU') {
      calculated = calculateCAM_ICU(req.body.subscores);
    }
    const result = await db.query(`
      INSERT INTO icu_scores (tenant_id, admission_id, score_type, score_value, subscores, calculated_at, calculated_by_user_id)
      VALUES ($1, $2, $3, $4, $5, NOW(), $6) RETURNING *
    `, [req.tenantId, req.params.id, req.body.scoreType, calculated.total || calculated.positive, JSON.stringify(calculated), req.user.id]);
    res.status(201).json(result.rows[0]);
  }
);

// POST /api/micu/admissions/:id/vasoactive (CRITICAL: requires senior MD)
router.post('/micu/admissions/:id/vasoactive',
  requireAuth, requireTenantScope, requireRole(['doctor']),
  validateBody(RS.vasoactive_order),
  idempotencyGuard,
  auditMiddleware('vasoactive_order'),
  async (req, res) => {
    // High-alert medication: require double-check
    if (req.user.role !== 'attending' && !req.body.attendingCoSign) {
      return res.status(403).json({ error: 'High-alert medication requires attending co-sign' });
    }
    const result = await db.query(`
      INSERT INTO icu_vasoactive_drips (tenant_id, admission_id, drug_name, started_at, dose_mcg_kg_min, ordered_by_user_id)
      VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *
    `, [req.tenantId, req.params.id, req.body.drugName, req.body.dose, req.user.id]);
    res.status(201).json(result.rows[0]);
  }
);

// POST /api/micu/early-warning (AI risk scoring)
router.post('/micu/early-warning',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']),
  validateBody(RS.vitals_input),
  async (req, res) => {
    const score = calculateQSOFA(req.body);
    const recommendations = [];
    if (score.highRisk) {
      recommendations.push('Activate sepsis bundle');
      recommendations.push('Draw lactate + blood cultures');
      recommendations.push('Start empiric antibiotics within 1h');
    }
    res.json({ riskScore: score.total, riskLevel: score.highRisk ? 'HIGH' : 'LOW', recommendations });
  }
);

// PUT /api/micu/admissions/:id/code-status
router.put('/micu/admissions/:id/code-status',
  requireAuth, requireTenantScope, requireRole(['doctor']),
  validateBody(RS.code_status_update),
  auditMiddleware('code_status_change'),
  async (req, res) => {
    const result = await db.query(`
      INSERT INTO icu_code_status (tenant_id, admission_id, status, effective_at, documented_by_user_id, family_meeting)
      VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *
    `, [req.tenantId, req.params.id, req.body.status, req.user.id, req.body.familyMeeting]);
    res.json(result.rows[0]);
  }
);
```

## Error Codes
- 400: Bad request (validation)
- 401: Unauthenticated
- 403: Unauthorized (role check, co-sign required)
- 404: Admission not found
- 409: Idempotency conflict
- 422: Business rule (e.g., dose out of range)
- 500: Internal error
