# NEPH-001 — Legal + RAG + LLM Obs + Data Flow + Routes (combined)

## Legal Consent
1. Hemodialysis
2. Peritoneal dialysis
3. Living kidney donor
4. Deceased donor transplant
5. CRRT
6. Plasmapheresis
7. Immunosuppression
8. Kidney biopsy
9. AVF/AVG
10. Tunneled catheter

## RAG Chains
1. AKI workup (pre-renal, renal, post-renal)
2. CKD progression (KDIGO)
3. HD adequacy (Kt/V, URR)
4. PD peritonitis
5. Transplant rejection (acute, chronic, AMR)
6. Electrolyte emergency
7. Glomerulonephritis workup

## LLM Observability
- Project: nama-medical-neph
- Metrics: eGFR accuracy, AKI stage
- Golden: 50 (AKI 10, CKD 10, HD 10, transplant 10, electrolyte 10)
- Eval: pre-deploy full, nightly 10%

## Data Flow
- CKD outpatient: labs → eGFR → stage → plan + education
- AKI: search cause → treat
- HD: vitals + labs → run → monitor
- Transplant: workup → MDT → list → transplant → follow-up

## Routes
```js
router.get('/neph/encounters', requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']), async (req, res) => {
  const r = await db.query(`SELECT e.*, p.full_name, p.mrn FROM neph_encounters e JOIN patients p ON p.id = e.patient_id WHERE e.tenant_id = $1`, [req.tenantId]);
  res.json(r.rows);
});

router.post('/neph/risk/egfr', requireAuth, requireTenantScope, requireRole(['doctor', 'nurse']), validateBody(RS.egfr_input), async (req, res) => {
  res.json(calculateEGFR(req.body.creatinine, req.body.age, req.body.sex));
});
```

## Middleware
- Renal dose adjustment mandatory
- High-alert (K+, insulin, Kayexalate, diuretic)
- HD water quality check
- Audit

## Design Tokens — eGFR
| Token | Hex | Use |
|---|---|---|
| `--egfr-good` | #10B981 | ≥60 |
| `--egfr-mod` | #F59E0B | 30-59 |
| `--egfr-low` | #DC2626 | <30 |
| `--egfr-fail` | #7C3AED | <15 (dialysis) |

## L4 Validation: 6/6 PASS
