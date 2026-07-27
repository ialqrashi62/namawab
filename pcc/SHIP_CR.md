# P3-CR Ship Report

**Version:** v3.56.0
**Modules:** 3 (pcc_surgical_checklist, pcc_handoff, pcc_safety)
**Tests:** +72 (30 unit + 42 integ) → **5703 total**
**Audit:** 249 PASS (was 246)

## What shipped

| Module | Endpoint | Functions |
|---|---|---|
| pcc_surgical_checklist | /api/v1/pcc-surgical-checklist/{list,call/:fn,record} | SignIn, TimeOut, SignOut, SiteMark, AllergyCheck, AntibioConfirm, ImplantConfirm, CountsFinal, SpecimenConfirm, Recovery |
| pcc_handoff | /api/v1/pcc-handoff/{list,call/:fn,record} | Ipass, Sbar, Shift, Discharge, Icu, Or, Er, Anesthesia, Primary, Receiving |
| pcc_safety | /api/v1/pcc-safety/{list,call/:fn,record} | Fall, Restraint, Suicide, Elopement, Mislabel, WrongPt, Fire, Radiation, Sharps, Hazard |

## Server

- `pcc/server.js` v3.56.0, 251 modules wired
- 3 endpoints verified

## Audit

- 249/249 PASS

## Next: P3-CS candidates

`pcc_sepsis`, `pcc_code_blue`, `pcc_stroke_path`
