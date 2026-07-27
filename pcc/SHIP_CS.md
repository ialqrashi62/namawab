# P3-CS Ship Report

**Version:** v3.57.0
**Modules:** 3 (pcc_sepsis, pcc_code_blue, pcc_stroke_path)
**Tests:** +72 (30 unit + 42 integ) → **5775 total**
**Audit:** 252 PASS (was 249)

## What shipped

| Module | Endpoint | Functions |
|---|---|---|
| pcc_sepsis | /api/v1/pcc-sepsis/{list,call/:fn,record} | Screening, Lactate, Abx, Fluid, Vasopressor, Culture, SourceCtl, DeEscalate, Procalcitonin, SepsisShock |
| pcc_code_blue | /api/v1/pcc-code-blue/{list,call/:fn,record} | Confirm, Cpr, Defib, Epi, Amio, Airway, Rhythm, Rosc, Etiology, Termination |
| pcc_stroke_path | /api/v1/pcc-stroke-path/{list,call/:fn,record} | Nihss, Imaging, Tpa, Thrombectomy, Consent, BpTarget, NihssFollowup, Hemorrhage, Swallow, Transfer |

## Server

- `pcc/server.js` v3.57.0, 254 modules wired
- 3 endpoints verified

## Audit

- 252/252 PASS

## Next: P3-CT candidates

`pcc_ambulatory`, `pcc_specialty_clinic`, `pcc_urgent_care`
