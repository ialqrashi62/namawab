# P3-CG Ship Report

**Version:** v3.45.0
**Modules:** 3 (pcc_pharmacy, pcc_dialysis, pcc_oncology_ext)
**Tests:** +72 (30 unit + 42 integ) → **4911 total**
**Audit:** 216 PASS (was 213)

## What shipped

| Module | Endpoint | Functions |
|---|---|---|
| pcc_pharmacy | /api/v1/pcc-pharmacy/{list,call/:fn,record} | Dispense, Interaction, Allergy, DoseCheck, Refill, Compounding, Narcotic, IVAdmixture, Formulary, Counseling |
| pcc_dialysis | /api/v1/pcc-dialysis/{list,call/:fn,record} | Access, Treatment, Clearance, DryWeight, Ultrafiltration, Heparin, Sodium, Bicarbonate, Reuse, KtV |
| pcc_oncology_ext | /api/v1/pcc-oncology-ext/{list,call/:fn,record} | Regimen, Cycle, Toxicity, Response, DoseReduction, HoldReason, Biomarker, Survivorship, TumorBoard, Palliative |

## Server

- `pcc/server.js` v3.45.0, 218 modules wired
- 3 endpoints verified via `Invoke-WebRequest` → JSON 200 OK

## Audit

- 216/216 PASS

## Next: P3-CH candidates

`pcc_surgical_ext`, `pcc_perioperative`, `pcc_postop`
