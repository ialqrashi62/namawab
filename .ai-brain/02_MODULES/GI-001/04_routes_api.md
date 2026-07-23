# GI-001 — Routes

```js
router.get('/gi/encounters', requireAuth, requireTenantScope, requireRole(['doctor', 'nurse', 'admin']), async (req, res) => {
  const r = await db.query(`
    SELECT e.*, p.full_name, p.mrn FROM gi_encounters e
    JOIN patients p ON p.id = e.patient_id
    WHERE e.tenant_id = $1
  `, [req.tenantId]);
  res.json(r.rows);
});

router.post('/gi/risk/meld', requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']), validateBody(RS.meld_input), async (req, res) => {
  res.json(calculateMELD(req.body));
});

router.post('/gi/risk/childpugh', requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']), validateBody(RS.childpugh_input), async (req, res) => {
  res.json(calculateChildPugh(req.body));
});

router.post('/gi/risk/gbs', requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']), validateBody(RS.gbs_input), async (req, res) => {
  res.json(calculateGlasgowBlatchford(req.body));
});
```
