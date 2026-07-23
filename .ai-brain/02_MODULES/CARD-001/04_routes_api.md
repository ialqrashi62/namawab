# CARD-001 — Routes & API

```js
// GET /api/card/encounters
router.get('/card/encounters',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse', 'admin']),
  async (req, res) => {
    const r = await db.query(`
      SELECT e.*, p.full_name, p.mrn, p.dob
      FROM card_encounters e
      JOIN patients p ON p.id = e.patient_id
      WHERE e.tenant_id = $1
      ORDER BY e.started_at DESC
    `, [req.tenantId]);
    res.json(r.rows);
  }
);

// POST /api/card/encounters
router.post('/card/encounters',
  requireAuth, requireTenantScope, requireRole(['doctor']),
  validateBody(RS.card_encounter),
  async (req, res) => {
    const r = await db.query(`
      INSERT INTO card_encounters (tenant_id, patient_id, encounter_type, started_at, primary_diagnosis)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [req.tenantId, ...req.body]);
    res.status(201).json(r.rows[0]);
  }
);

// POST /api/card/risk/timi
router.post('/card/risk/timi',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']),
  validateBody(RS.timi_input),
  async (req, res) => {
    const result = calculateTIMI(req.body);
    res.json(result);
  }
);

// POST /api/card/risk/grace
router.post('/card/risk/grace',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']),
  validateBody(RS.grace_input),
  async (req, res) => {
    const result = calculateGRACE(req.body);
    res.json(result);
  }
);

// POST /api/card/risk/heart
router.post('/card/risk/heart',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']),
  validateBody(RS.heart_input),
  async (req, res) => {
    const result = calculateHEARTScore(req.body);
    res.json(result);
  }
);

// POST /api/card/risk/cha2ds2vasc
router.post('/card/risk/cha2ds2vasc',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']),
  validateBody(RS.cha2ds2vasc_input),
  async (req, res) => {
    const result = calculateCHA2DS2VASc(req.body);
    res.json(result);
  }
);

// POST /api/card/risk/hasbled
router.post('/card/risk/hasbled',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']),
  validateBody(RS.hasbled_input),
  async (req, res) => {
    const result = calculateHASBLED(req.body);
    res.json(result);
  }
);

// POST /api/card/encounters/:id/ecgs
router.post('/card/encounters/:id/ecgs',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']),
  validateBody(RS.ecg_record),
  async (req, res) => {
    const result = await db.query(`
      INSERT INTO card_ecgs (tenant_id, encounter_id, recorded_at, rate, rhythm, pr_interval_ms, qrs_duration_ms, qtc_ms, axis, interpretation, critical_findings)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
    `, [req.tenantId, req.params.id, ...]);
    res.status(201).json(result.rows[0]);
  }
);
```

## Middleware
- requireAuth, requireTenantScope, requireRole, validateBody
- For medication orders: high-alert guard (anticoag, antiplatelet)
- For procedures: idempotencyGuard (PCI)
- Audit log for every order + procedure
