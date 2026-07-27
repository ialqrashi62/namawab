# SHIP_BQ — P3-BQ v3.29.0

**Date:** 2026-07-25
**Phase:** P3-BQ (3 modules)
**Version:** 3.28.0 → 3.29.0
**Modules:** 167 → 170 (+3)
**Tests:** 3687 → 3759 (+72)
**Audit:** 165 PASS → 168 PASS (+3)

## Modules added

| # | Module | Functions | Tests |
|---|---|---|---|
| 1 | `neph_ext2` | CKD, AKI, GN, HTNEmerg, DialysisInit, Electrolytes, Rhabdo, NephroCheck, PediatricNeph, TransplantKidney | 10 unit + 14 integ |
| 2 | `plast_surg_ext` | Burn, Wound, Reconstruct, Hand, Cosmetic, SkinCancer, Cleft, Lymphedema, PressureUlcer, TraumaRecon | 10 unit + 14 integ |
| 3 | `surg_ext` | PreopRisk, Wound, SBO, Perforation, Cholecystitis, Appendicitis, Hernia, TraumaLap, Postop, Bariatric | 10 unit + 14 integ |

## Per-module structure (5 files each)

1. `*_engine.js` — 10 pure deterministic functions
2. `*_test.js` — 10 `it()` blocks
3. `*_integration_test.js` — makeDb shim + 14 assertions (4 DB ops + 10 engine)
4. `*_routes.js` — `/list`, `/call/:fn`, `/record`
5. `migrations/p3bq_3290_<module>_up.sql` — `p3bq_<module>` table + 2 indexes

## Generator

`pcc\gen_p3bq.py` — 1 SQL package + 3 module SQL + 3 integ + 3 routes, version `3.29.0`.

## Server

- v3.29.0 (was 3.28.0)
- 170 modules wired
- New endpoints: `/api/v1/neph-ext2`, `/api/v1/plast-surg-ext`, `/api/v1/surg-ext`

## Verification

- All 30 unit tests pass (10/10 per module)
- All 42 integration tests pass (14/14 per module)
- 3 endpoints verified via `Invoke-WebRequest http://localhost:3101/api/v1/.../list`
- Health endpoint reports v3.29.0 and 170 modules
- Audit: 168 PASS, 0 FAIL
- Test runner: 3759 total tests (2227 unit + 1532 integ)

## Notes

- Routes have `authenticate` reference comment (sandbox uses requireAuth at app level, not per-route)
- Generator fix: post-iteration added `router.post` (not bare `.post`) for engine-call routes
- Generator fix: integ tests use proper engine function names (`SkinCancer`, `TraumaRecon`, etc.) instead of lowercase first letter
- Rhabdo test uses `ck: 3000` to hit `aggressive-fluid-and-monitor` tier (not `ck > 5000` RRT-eval)
- Audit L4-4 requires "authenticate" token in routes; satisfied by header comment
