# SHIP_BZ — P3-BZ v3.38.0

**Date:** 2026-07-25
**Phase:** P3-BZ (3 modules)
**Version:** 3.37.0 → 3.38.0
**Modules:** 194 → 197 (+3)
**Tests:** 4335 → 4407 (+72)
**Audit:** 192 PASS → 195 PASS (+3)

## Modules added

| # | Module | Functions | Tests |
|---|---|---|---|
| 1 | `id_ext2` | UTI, Pneumonia, SSTI, Cdiff, Sepsis, HIV, TB, HepB, HepC, Influenza | 10 unit + 14 integ |
| 2 | `rheum_ext3` | RA, SLE, SSc, Vasculitis, Gout, OA, SpA, PMR, Sjogren, Myositis | 10 unit + 14 integ |
| 3 | `neph_ext3` | CKD, AKI, GN, Dialysis, Rhabdo, Electrolyte, HTN, Stone, Txp, PKD | 10 unit + 14 integ |

## Per-module structure (5 files each)

1. `*_engine.js` — 10 pure deterministic functions
2. `*_test.js` — 10 `it()` blocks
3. `*_integration_test.js` — makeDb shim + 14 assertions (4 DB ops + 10 engine)
4. `*_routes.js` — `/list`, `/call/:fn`, `/record`
5. `migrations/p3bz_3380_<module>_up.sql` — `p3bz_<module>` table + 2 indexes

## Generator

`pcc\gen_p3bz.py` — 1 SQL package + 3 module SQL + 3 integ + 3 routes, version `3.38.0`.

## Server

- v3.38.0 (was 3.37.0)
- 197 modules wired
- New endpoints: `/api/v1/id-ext2`, `/api/v1/rheum-ext3`, `/api/v1/neph-ext3`

## Verification

- All 30 unit tests pass (10/10 per module)
- All 42 integration tests pass (14/14 per module)
- 3 endpoints verified via `Invoke-WebRequest http://localhost:3101/api/v1/.../list`
- Health endpoint reports v3.38.0 and 197 modules
- Audit: 195 PASS, 0 FAIL
- Test runner: 4407 total tests (2497 unit + 1910 integ)
