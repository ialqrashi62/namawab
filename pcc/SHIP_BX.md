# SHIP_BX — P3-BX v3.36.0

**Date:** 2026-07-25
**Phase:** P3-BX (3 modules)
**Version:** 3.35.0 → 3.36.0
**Modules:** 188 → 191 (+3)
**Tests:** 4191 → 4263 (+72)
**Audit:** 186 PASS → 189 PASS (+3)

## Modules added

| # | Module | Functions | Tests |
|---|---|---|---|
| 1 | `endo_ext2` | Diabetes, Thyroid, Adrenal, Pituitary, Calcium, Bone, AdrenalMass, Obesity, Lipid, ReproEndo | 10 unit + 14 integ |
| 2 | `ortho_ext2` | Fracture, Joint, Spine, Sports, Trauma, Tumor, Hand, Foot, Pediatric, Recon | 10 unit + 14 integ |
| 3 | `cardio_ext3` | ACS, HF, AF, Valve, HTN, Lipid, Anticoag, EP, Pericardial, PAD | 10 unit + 14 integ |

## Per-module structure (5 files each)

1. `*_engine.js` — 10 pure deterministic functions
2. `*_test.js` — 10 `it()` blocks
3. `*_integration_test.js` — makeDb shim + 14 assertions (4 DB ops + 10 engine)
4. `*_routes.js` — `/list`, `/call/:fn`, `/record`
5. `migrations/p3bx_3360_<module>_up.sql` — `p3bx_<module>` table + 2 indexes

## Generator

`pcc\gen_p3bx.py` — 1 SQL package + 3 module SQL + 3 integ + 3 routes, version `3.36.0`.

## Server

- v3.36.0 (was 3.35.0)
- 191 modules wired
- New endpoints: `/api/v1/endo-ext2`, `/api/v1/ortho-ext2`, `/api/v1/cardio-ext3`

## Verification

- All 30 unit tests pass (10/10 per module)
- All 42 integration tests pass (14/14 per module)
- 3 endpoints verified via `Invoke-WebRequest http://localhost:3101/api/v1/.../list`
- Health endpoint reports v3.36.0 and 191 modules
- Audit: 189 PASS, 0 FAIL
- Test runner: 4263 total tests (2437 unit + 1826 integ)
