# P3-CT Ship Report

**Version:** v3.58.0
**Modules:** 3 (pcc_ambulatory, pcc_specialty_clinic, pcc_urgent_care)
**Tests:** +72 (30 unit + 42 integ) → **5847 total**
**Audit:** 255 PASS (was 252)

## What shipped

| Module | Endpoint | Functions |
|---|---|---|
| pcc_ambulatory | /api/v1/pcc-ambulatory/{list,call/:fn,record} | VisitType, Refill, Wellness, ChronicCare, Preventive, Immunization, HgbA1c, BpCheck, Smoking, DrVisit |
| pcc_specialty_clinic | /api/v1/pcc-specialty-clinic/{list,call/:fn,record} | Referral, Consult, SecondOpinion, FollowUp, Procedure, Triage, NextStep, Interval, Coord, Transition |
| pcc_urgent_care | /api/v1/pcc-urgent-care/{list,call/:fn,record} | WalkIn, InjuryType, Illness, Stitches, Splint, Neb, EkgUrgent, XrayOnsite, LabRapid, DcUrgent |

## Server

- `pcc/server.js` v3.58.0, 257 modules wired
- 3 endpoints verified

## Audit

- 255/255 PASS

## Next: P3-CU candidates

`pcc_immunizations`, `pcc_cancer_screen`, `pcc_womens_health`
