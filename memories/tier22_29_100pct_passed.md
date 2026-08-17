# TIER22-29 ALL 100% PASSED — Cardiac mitraclip fix deployed
**Date:** 2026-08-05

## Results
| Tier | Smoke | PASS | FAIL |
|------|-------|------|------|
| 14 pharm | 30/30 | 30 | 0 |
| 17 portal | 25/25 | 25 | 0 |
| 18 infx | 25/25 | 25 | 0 |
| 19 him | 25/25 | 25 | 0 |
| 20 research | 25/25 | 25 | 0 |
| 21 sched | 30/30 | 30 | 0 |
| 22 wound | 25/25 | 25 | 0 |
| 23 dialysis | 25/25 | 25 | 0 |
| 24 tx | 25/25 | 25 | 0 |
| 25 rehab | 25/25 | 25 | 0 |
| 26 oncology | 25/25 | 25 | 0 |
| 27 emergency | 25/25 | 25 | 0 |
| 28 obstetrics | 25/25 | 25 | 0 |
| 29 cardiology | 25/25 | 25 | 0 |

**Total: 14 waves, 375 endpoints, 0 failures.**

## Fix
- `tier29_cardiology_ext_180_cath_engine.js`: `mitraclip` had `ensureBool(req.strait_orifice_area, 'soa')` — should be `ensureNumber`. SOA is in cm², not bool. Changed to `ensureNumber` + check `< 1.5`.

## Commit
`33920f3a fix(tier29): mitraclip soa ensureNumber instead of ensureBool`

## Next
TIER30 candidate: Hematology (already shipped TIER6 base), so go deeper — **Hematology Extended**: transfusion, aphemesis, stem_cell_collection, cell_therapy, coagulation_extended.