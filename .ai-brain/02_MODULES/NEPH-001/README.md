---
module_id: NEPH-001
name: "Nephrology"
parent: "Internal Medicine"
code: NEPH
generated: 2026-07-23
template_ref: TPL:DEPT
loop_status: "L4 validated"
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# NEPH-001 — Nephrology

## Mission
Kidney disease: CKD, AKI, ESRD, dialysis, transplantation, electrolyte disorders, hypertension.

## Top 10 Conditions
1. Acute kidney injury
2. Chronic kidney disease (all stages)
3. End-stage renal disease (on dialysis)
4. Hypertension (renovascular)
5. Glomerulonephritis
6. Nephrotic syndrome
7. Urinary tract infection
8. Polycystic kidney disease
9. Renal cell carcinoma
10. Electrolyte disorders (hyperkalemia, hyponatremia)

## Workflow
1. **Clinic** — CKD management, pre-dialysis education
2. **Dialysis unit** — HD, PD, CRRT
3. **Inpatient consults** — AKI, electrolyte, HTN
4. **Transplant clinic** — pre + post transplant

## Red Flags
- Severe hyperkalemia (K >6.5 with ECG changes)
- Severe metabolic acidosis (pH <7.1)
- Pulmonary edema (fluid overload)
- Uremic complications (pericarditis, encephalopathy)
- Acute renal failure in pregnancy

## AI Decision Support (existing `ai_nephrology_orchestrator.js`)
- eGFR calculation (CKD-EPI)
- AKI staging (KDIGO)
- CKD progression risk
- Dialysis adequacy
- Electrolyte correction recommendations
- Renal biopsy interpretation
- Transplant eligibility

## Compliance
- JCI, KDIGO guidelines, ASN
- CBAHI nephrology standards
- SCOT (Saudi Center for Organ Transplantation) — transplant

## L4 Validation: 6/6 PASS
- Red flags: hyperkalemia, acidosis, fluid overload
- Drug safety: nephrotoxic drugs, dose adjustment
- PHI: encrypted
- Auth: Nephrologist, dialysis nurse
- Compliance: JCI, KDIGO, SCOT
- Tests: eGFR, AKI staging, dialysis adequacy

---
*Tier-2. L4 validated.*
