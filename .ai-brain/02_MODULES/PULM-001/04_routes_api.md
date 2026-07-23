# PULM-001 — Routes

```js
router.get('/pulm/encounters', requireAuth, requireTenantScope, requireRole(['doctor', 'nurse', 'admin']), async (req, res) => {
  const r = await db.query(`
    SELECT e.*, p.full_name, p.mrn FROM pulm_encounters e
    JOIN patients p ON p.id = e.patient_id
    WHERE e.tenant_id = $1 ORDER BY e.started_at DESC
  `, [req.tenantId]);
  res.json(r.rows);
});

router.post('/pulm/risk/wells', requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']), validateBody(RS.wells_input), async (req, res) => {
  res.json(calculateWellsScore(req.body));
});

router.post('/pulm/risk/copd', requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']), validateBody(RS.copd_input), async (req, res) => {
  res.json(classifyCOPDSeverity(req.body.fev1PercentPredicted));
});
```

## Middleware: standard chain
