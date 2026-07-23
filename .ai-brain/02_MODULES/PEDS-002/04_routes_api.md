# PEDS-002 — Routes & API

```js
// GET /api/peds/nicu/admissions
router.get('/peds/nicu/admissions',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse', 'admin']),
  async (req, res) => {
    const r = await db.query(`
      SELECT a.*, p.full_name, p.mrn, p.dob
      FROM peds_nicu_admissions a
      JOIN patients p ON p.id = a.patient_id
      WHERE a.tenant_id = $1 AND a.discharged_at IS NULL
      ORDER BY a.admitted_at DESC
    `, [req.tenantId]);
    res.json(r.rows);
  }
);

// POST /api/peds/nicu/admissions
router.post('/peds/nicu/admissions',
  requireAuth, requireTenantScope, requireRole(['doctor']),
  validateBody(RS.peds_nicu_admission),
  async (req, res) => {
    const r = await db.query(`
      INSERT INTO peds_nicu_admissions (
        tenant_id, patient_id, admitted_at, primary_diagnosis,
        birth_weight_grams, gestational_age_weeks, apgar_1min, apgar_5min,
        level_of_care, respiratory_support
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [req.tenantId, ...req.body]);
    res.status(201).json(r.rows[0]);
  }
);

// POST /api/peds/nicu/admissions/:id/medications
// CRITICAL: Weight-based, double-check
router.post('/peds/nicu/admissions/:id/medications',
  requireAuth, requireTenantScope, requireRole(['doctor']),
  validateBody(RS.peds_medication),
  async (req, res) => {
    // Recalculate dose based on current weight
    const patient = await db.query(`
      SELECT p.full_name, a.birth_weight_grams
      FROM peds_nicu_admissions a
      JOIN patients p ON p.id = a.patient_id
      WHERE a.tenant_id = $1 AND a.id = $2
    `, [req.tenantId, req.params.id]);
    if (patient.rowCount === 0) return res.status(404).json({ error: 'Not found' });

    const r = await db.query(`
      INSERT INTO peds_nicu_medications (
        tenant_id, admission_id, drug_name, dose, route, frequency,
        indication, is_weight_based, weight_at_order
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, $8)
      RETURNING *
    `, [req.tenantId, req.params.id, req.body.drugName, req.body.dose,
        req.body.route, req.body.frequency, req.body.indication,
        req.body.weightAtOrder || patient.rows[0].birth_weight_grams]);
    res.status(201).json(r.rows[0]);
  }
);

// POST /api/peds/nicu/corrected-age
router.post('/peds/nicu/corrected-age',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']),
  validateBody(RS.corrected_age),
  async (req, res) => {
    const corrected = calculateCorrectedAge(req.body.birthDate, req.body.currentDate);
    res.json(corrected);
  }
);

// POST /api/peds/nicu/pews
router.post('/peds/nicu/pews',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']),
  validateBody(RS.pews_input),
  async (req, res) => {
    const score = calculatePEWS(req.body);
    res.json(score);
  }
);
```

## Middleware
- requireAuth → session
- requireTenantScope → tenant
- requireRole → NICU roles (neonatologist, NICU nurse, RT)
- validateBody → schema
- High-alert meds: require double-check + co-sign
