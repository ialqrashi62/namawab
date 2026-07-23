# OBG-001 — Routes & API

```js
// GET /api/obg/pregnancies
router.get('/obg/pregnancies',
  requireAuth, requireTenantScope, requireRole(['doctor', 'nurse', 'midwife', 'admin']),
  async (req, res) => {
    const r = await db.query(`
      SELECT p.*, pt.full_name, pt.mrn, pt.dob
      FROM obg_pregnancies p
      JOIN patients pt ON pt.id = p.patient_id
      WHERE p.tenant_id = $1
      ORDER BY p.edd_date
    `, [req.tenantId]);
    res.json(r.rows);
  }
);

// POST /api/obg/pregnancies
router.post('/obg/pregnancies',
  requireAuth, requireTenantScope, requireRole(['doctor', 'midwife']),
  validateBody(RS.pregnancy_create),
  async (req, res) => {
    const r = await db.query(`
      INSERT INTO obg_pregnancies (
        tenant_id, patient_id, lmp_date, edd_date, gravida, para, abortions,
        blood_type, rh_factor, bmi, pre_pregnancy_weight_kg
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [req.tenantId, ...req.body]);
    res.status(201).json(r.rows[0]);
  }
);

// POST /api/obg/pregnancies/:id/preeclampsia-screen
router.post('/obg/pregnancies/:id/preeclampsia-screen',
  requireAuth, requireTenantScope, requireRole(['doctor', 'midwife', 'nurse']),
  validateBody(RS.preeclampsia_screen),
  async (req, res) => {
    const classification = classifyPreeclampsia(
      { systolic: req.body.bpSystolic, diastolic: req.body.bpDiastolic },
      req.body.proteinuria,
      req.body.symptoms,
      req.body
    );
    const r = await db.query(`
      INSERT INTO obg_preeclampsia_screenings (
        tenant_id, pregnancy_id, bp_systolic, bp_diastolic, proteinuria,
        symptoms, platelets, aspartate_aminotransferase, classification
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [req.tenantId, req.params.id, req.body.bpSystolic, req.body.bpDiastolic,
        req.body.proteinuria, req.body.symptoms, req.body.platelets,
        req.body.aspartateAminotransferase, classification]);
    res.status(201).json(r.rows[0]);
  }
);

// POST /api/obg/preeclampsia-risk
router.post('/obg/preeclampsia-risk',
  requireAuth, requireTenantScope, requireRole(['doctor', 'midwife']),
  validateBody(RS.aspre_input),
  async (req, res) => {
    const result = calculateASPRERisk(req.body);
    res.json(result);
  }
);

// POST /api/obg/deliveries
router.post('/obg/deliveries',
  requireAuth, requireTenantScope, requireRole(['doctor', 'midwife']),
  validateBody(RS.delivery_create),
  async (req, res) => {
    const r = await db.query(`
      INSERT INTO obg_deliveries (
        tenant_id, pregnancy_id, patient_id, delivery_date, delivery_mode,
        gestational_age_at_delivery, estimated_blood_loss_ml, apgar_1min, apgar_5min
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [req.tenantId, ...req.body]);
    res.status(201).json(r.rows[0]);
  }
);
```

## Middleware
- requireAuth → session
- requireTenantScope → tenant
- requireRole → OBG roles
- validateBody → schema

## Special Considerations
- **Pregnancy data:** PDPL special category, high sensitivity
- **Multi-gestation:** requires twin-specific workflow
- **IVF pregnancies:** additional data fields
- **Adolescent OB:** special consent + reporting
- **Fetal demise:** bereavement care protocol
