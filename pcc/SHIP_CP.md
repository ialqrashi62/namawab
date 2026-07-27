# P3-CP Ship Report

**Version:** v3.54.0
**Modules:** 3 (pcc_rehab_ext3, pcc_pall_ext3, pcc_home_health)
**Tests:** +72 (30 unit + 42 integ) → **5559 total**
**Audit:** 243 PASS (was 240)

## What shipped

| Module | Endpoint | Functions |
|---|---|---|
| pcc_rehab_ext3 | /api/v1/pcc-rehab-ext3/{list,call/:fn,record} | PhysTherapy, OccTherapy, SpeechLang, PostStroke, Sci, Tbi, Amp, Burnr, PreOp, Back |
| pcc_pall_ext3 | /api/v1/pcc-pall-ext3/{list,call/:fn,record} | PainMng, Dyspnea, Nausea, Constipation, Delirium, Anxietyp, Hospice, Advance, Family, Grief |
| pcc_home_health | /api/v1/pcc-home-health/{list,call/:fn,record} | Intake, Wound, IvTherapy, Therapy, MedAdmin, Tele, Falls, Caregiver, Discharge, AdmitHome |

## Server

- `pcc/server.js` v3.54.0, 245 modules wired
- 3 endpoints verified

## Audit

- 243/243 PASS

## Next: P3-CQ candidates

`pcc_diet_nutr`, `pcc_social_work`, `pcc_case_mgmt`
