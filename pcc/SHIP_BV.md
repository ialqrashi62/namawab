# SHIP_BV — P3-BV v3.34.0

**Date:** 2026-07-25
**Phase:** P3-BV (3 modules)
**Version:** 3.33.0 → 3.34.0
**Modules:** 182 → 185 (+3)
**Tests:** 4047 → 4119 (+72)
**Audit:** 180 PASS → 183 PASS (+3)

## Modules added

| # | Module | Functions | Tests |
|---|---|---|---|
| 1 | `gi_ext2` | Dysphagia, GERD, PUD, IBD, IBS, Celiac, Pancreatitis, Cirrhosis, Jaundice, Bleed | 10 unit + 14 integ |
| 2 | `ent_ext2` | Hearing, Tinnitus, Vertigo, Sinus, OSA, Hoarseness, NeckMass, Epistaxis, Dysphagia, Allergic | 10 unit + 14 integ |
| 3 | `derma_ext2` | Eczema, Psoriasis, Acne, Melanoma, BCC, Rash, Urticaria, Autoimmune, Infxn, Burns | 10 unit + 14 integ |

## Per-module structure (5 files each)

1. `*_engine.js` — 10 pure deterministic functions
2. `*_test.js` — 10 `it()` blocks
3. `*_integration_test.js` — makeDb shim + 14 assertions (4 DB ops + 10 engine)
4. `*_routes.js` — `/list`, `/call/:fn`, `/record`
5. `migrations/p3bv_3340_<module>_up.sql` — `p3bv_<module>` table + 2 indexes

## Generator

`pcc\gen_p3bv.py` — 1 SQL package + 3 module SQL + 3 integ + 3 routes, version `3.34.0`.

## Server

- v3.34.0 (was 3.33.0)
- 185 modules wired
- New endpoints: `/api/v1/gi-ext2`, `/api/v1/ent-ext2`, `/api/v1/derma-ext2`

## Verification

- All 30 unit tests pass (10/10 per module)
- All 42 integration tests pass (14/14 per module)
- 3 endpoints verified via `Invoke-WebRequest http://localhost:3101/api/v1/.../list`
- Health endpoint reports v3.34.0 and 185 modules
- Audit: 183 PASS, 0 FAIL
- Test runner: 4119 total tests (2377 unit + 1742 integ)
