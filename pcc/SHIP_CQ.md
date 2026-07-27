# P3-CQ Ship Report

**Version:** v3.55.0
**Modules:** 3 (pcc_diet_nutr, pcc_social_work, pcc_case_mgmt)
**Tests:** +72 (30 unit + 42 integ) → **5631 total**
**Audit:** 246 PASS (was 243)

## What shipped

| Module | Endpoint | Functions |
|---|---|---|
| pcc_diet_nutr | /api/v1/pcc-diet-nutr/{list,call/:fn,record} | Bmi, Tpn, Diet, Tube, Supplement, Malnutrition, Intolerance, Aspiration, Refeeding, Allerg |
| pcc_social_work | /api/v1/pcc-social-work/{list,call/:fn,record} | Assessment, Placement, Psychosocial, Saf, Financial, Transport, Family, Abuse, Substance, Resources |
| pcc_case_mgmt | /api/v1/pcc-case-mgmt/{list,call/:fn,record} | Intake, Coord, Dc, Transition, Followup, Barriers, Insurance, Uta, Readmission, Multidisc |

## Server

- `pcc/server.js` v3.55.0, 248 modules wired
- 3 endpoints verified

## Audit

- 246/246 PASS

## Next: P3-CR candidates

`pcc_surgical_checklist`, `pcc_handoff`, `pcc_safety`
