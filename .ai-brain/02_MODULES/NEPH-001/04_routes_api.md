# NEPH-001 — Routes + Middleware + Data Flow

## Routes
```js
router.get('/neph/encounters', requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']), async (req, res) => { ... });
router.post('/neph/risk/egfr', requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']), async (req, res) => {
  res.json(calculateEGFR(req.body.creatinine, req.body.age, req.body.sex));
});
```

## Middleware
- Standard chain
- Renal dose check (mandatory)
- High-alert meds (insulin, K+, Kayexalate, diuretic)
- Audit

## Data Flow
- Outpatient CKD: labs (Cr, BUN, eGFR) → stage → plan
- AKI: search cause (pre-renal, renal, post-renal) → treat
- HD: vitals + labs pre/post → run dialysis
- Transplant: MDT + workup
- Hyperkalemia: ECG + treatment
