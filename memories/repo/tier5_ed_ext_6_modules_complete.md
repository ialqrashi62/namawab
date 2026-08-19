# TIER5_ED_EXT-101..106 SHIPPED (2026-08-05)

36 endpoints live (e779-e784) — emergency dept integration.

| # | Module | Routes |
|---|---|---|
| 101 | Triage | /api/ed_triage/{esi,vital,complaint,acuity,pain,dispo} |
| 102 | Resus | /api/ed_resus/{acls,atls,sepsis,heme,stroke,ami} |
| 103 | Tox | /api/ed_tox/{overdose,antidote,enven,withd,toxidrome,pcc} |
| 104 | Trauma | /api/ed_trm/{primary,secondary,mech,dispo,pain,tetanus} |
| 105 | Peds | /api/ed_pds/{pews,dose,airway,resus,sepsis,trauma} |
| 106 | Obs | /api/ed_obs/{status,cdu,dchready,dchinstr,revisit,contin} |

**Smoke**: 36/36 PASS first try. Commits: 9f9fd899 (inner) / b3a5d538 (outer).
