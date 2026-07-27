# SHIP_BT — P3-BT v3.32.0

**Date:** 2026-07-25
**Phase:** P3-BT (3 modules)
**Version:** 3.31.0 → 3.32.0
**Modules:** 176 → 179 (+3)
**Tests:** 3903 → 3975 (+72)
**Audit:** 174 PASS → 177 PASS (+3)

## Modules added

| # | Module | Functions | Tests |
|---|---|---|---|
| 1 | `breast_ext` | Screen, Mass, Nipple, Cancer, BRCA, Mastectomy, Reconstruction, Lactation, Gynecomastia, Survivorship | 10 unit + 14 integ |
| 2 | `icu_ext2` | Ventilator, Sedation, Shock, DVT, Glucose, Electrolyte, Transfusion, CRRT, ICP, Nutrition | 10 unit + 14 integ |
| 3 | `obgyn_ext2` | Pregnancy, PreEclampsia, GDM, PPROM, PPH, Ectopic, Induction, GynCancer, Infertility, Menopause | 10 unit + 14 integ |

## Per-module structure (5 files each)

1. `*_engine.js` — 10 pure deterministic functions
2. `*_test.js` — 10 `it()` blocks
3. `*_integration_test.js` — makeDb shim + 14 assertions (4 DB ops + 10 engine)
4. `*_routes.js` — `/list`, `/call/:fn`, `/record`
5. `migrations/p3bt_3320_<module>_up.sql` — `p3bt_<module>` table + 2 indexes

## Generator

`pcc\gen_p3bt.py` — 1 SQL package + 3 module SQL + 3 integ + 3 routes, version `3.32.0`.

## Server

- v3.32.0 (was 3.31.0)
- 179 modules wired
- New endpoints: `/api/v1/breast-ext`, `/api/v1/icu-ext2`, `/api/v1/obgyn-ext2`

## Verification

- All 30 unit tests pass (10/10 per module)
- All 42 integration tests pass (14/14 per module)
- 3 endpoints verified via `Invoke-WebRequest http://localhost:3101/api/v1/.../list`
- Health endpoint reports v3.32.0 and 179 modules
- Audit: 177 PASS, 0 FAIL
- Test runner: 3975 total tests (2317 unit + 1658 integ)
