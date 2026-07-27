# SHIP_BU — P3-BU v3.33.0

**Date:** 2026-07-25
**Phase:** P3-BU (3 modules)
**Version:** 3.32.0 → 3.33.0
**Modules:** 179 → 182 (+3)
**Tests:** 3975 → 4047 (+72)
**Audit:** 177 PASS → 180 PASS (+3)

## Modules added

| # | Module | Functions | Tests |
|---|---|---|---|
| 1 | `neonatal_ext3` | Apnea, Jaundice, SepsisScreen, NEC, BPD, IVH, ROP, Cooling, Feed, Discharge | 10 unit + 14 integ |
| 2 | `perinatal_ext3` | Anomaly, Triploidy, Twins, Previa, Accreta, Preterm, ROM, Induction, Postdates, Postpartum | 10 unit + 14 integ |
| 3 | `hem_ext2` | Anemia, Thrombocyt, Coag, DVT, Anticoag, Bleed, TTP, DIC, Sickle, Lymphoma | 10 unit + 14 integ |

## Per-module structure (5 files each)

1. `*_engine.js` — 10 pure deterministic functions
2. `*_test.js` — 10 `it()` blocks
3. `*_integration_test.js` — makeDb shim + 14 assertions (4 DB ops + 10 engine)
4. `*_routes.js` — `/list`, `/call/:fn`, `/record`
5. `migrations/p3bu_3330_<module>_up.sql` — `p3bu_<module>` table + 2 indexes

## Generator

`pcc\gen_p3bu.py` — 1 SQL package + 3 module SQL + 3 integ + 3 routes, version `3.33.0`.

## Server

- v3.33.0 (was 3.32.0)
- 182 modules wired
- New endpoints: `/api/v1/neonatal-ext3`, `/api/v1/perinatal-ext3`, `/api/v1/hem-ext2`

## Verification

- All 30 unit tests pass (10/10 per module)
- All 42 integration tests pass (14/14 per module)
- 3 endpoints verified via `Invoke-WebRequest http://localhost:3101/api/v1/.../list`
- Health endpoint reports v3.33.0 and 182 modules
- Audit: 180 PASS, 0 FAIL
- Test runner: 4047 total tests (2347 unit + 1700 integ)
