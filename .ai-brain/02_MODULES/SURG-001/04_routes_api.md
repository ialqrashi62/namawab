# SURG-001 — Routes & API

```js
// GET /api/surg/procedures
router.get('/surg/procedures',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse', 'admin']),
  async (req, res) => {
    const r = await db.query(`
      SELECT p.*, pt.full_name, pt.mrn, s.surgeon_name, s.anesthetist_name
      FROM surg_procedures p
      JOIN patients pt ON pt.id = p.patient_id
      LEFT JOIN users s ON s.id = p.surgeon_user_id
      WHERE p.tenant_id = $1
      ORDER BY p.scheduled_at
    `, [req.tenantId]);
    res.json(r.rows);
  }
);

// POST /api/surg/procedures
router.post('/surg/procedures',
  requireAuth, requireTenantScope, requireRole(['doctor']),
  validateBody(RS.surg_procedure),
  async (req, res) => {
    const r = await db.query(`
      INSERT INTO surg_procedures (
        tenant_id, patient_id, scheduled_at, procedure_name, cpt_code,
        urgency, asa_class, surgeon_user_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [req.tenantId, ...req.body]);
    res.status(201).json(r.rows[0]);
  }
);

// PUT /api/surg/procedures/:id/preop-check
router.put('/surg/procedures/:id/preop-check',
  requireAuth, requireTenantScope, requireRole(['nurse', 'doctor']),
  validateBody(RS.preop_check),
  async (req, res) => {
    const r = await db.query(`
      UPDATE surg_procedures SET
        npo_confirmed = $1, site_marked = $2, antibiotic_given = $3,
        consent_signed = $4, anesthesia_plan = $5, vte_prophylaxis = $6
      WHERE tenant_id = $7 AND id = $8 RETURNING *
    `, [req.body.npoConfirmed, req.body.siteMarked, req.body.antibioticGiven,
        req.body.consentSigned, req.body.anesthesiaPlan, req.body.vteProphylaxis,
        req.tenantId, req.params.id]);
    res.json(r.rows[0]);
  }
);

// POST /api/surg/procedures/:id/intraop
router.post('/surg/procedures/:id/intraop',
  requireAuth, requireTenantScope, requireRole(['doctor']),
  validateBody(RS.intraop_record),
  async (req, res) => {
    const r = await db.query(`
      INSERT INTO surg_intraop (
        tenant_id, procedure_id, anesthesia_type, estimated_blood_loss_ml,
        timeout_performed, site_marked, counts_correct, complications
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
    `, [req.tenantId, req.params.id, ...]);
    res.status(201).json(r.rows[0]);
  }
);
```

## Middleware
- requireAuth
- requireTenantScope
- requireRole (surgery roles)
- validateBody
- For OR booking: idempotency required
- Audit log for every procedure
