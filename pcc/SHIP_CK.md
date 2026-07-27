# P3-CK Ship Report

**Version:** v3.49.0
**Modules:** 3 (pcc_neuro_ext2, pcc_psych_ext3, pcc_neonatal_ext2)
**Tests:** +72 (30 unit + 42 integ) → **5199 total**
**Audit:** 228 PASS (was 225)

## What shipped

| Module | Endpoint | Functions |
|---|---|---|
| pcc_neuro_ext2 | /api/v1/pcc-neuro-ext2/{list,call/:fn,record} | StrokeScale, Seizure, Headache, GCS, Neuropathy, Movement, Dementia, Ms, Gbs, Myasthenia |
| pcc_psych_ext3 | /api/v1/pcc-psych-ext3/{list,call/:fn,record} | Screening, Risk, Depression, Anxiety, Substance, Psychosis, Bipolar, MedMgmt, Therapy, Restraint |
| pcc_neonatal_ext2 | /api/v1/pcc-neonatal-ext2/{list,call/:fn,record} | GestationAge, APGAR, BirthWeight, NewbornScreen, Breastfeed, Hyperbilirubin, Feeding, DischargeChecklist, SepsisEval, CordCare |

## Server

- `pcc/server.js` v3.49.0, 230 modules wired
- 3 endpoints verified

## Audit

- 228/228 PASS

## Next: P3-CL candidates

`pcc_cardio_ext4`, `pcc_ortho_ext3`, `pcc_derma_ext3`
