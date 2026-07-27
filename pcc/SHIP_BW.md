# SHIP_BW — P3-BW v3.35.0

**Date:** 2026-07-25
**Phase:** P3-BW (3 modules)
**Version:** 3.34.0 → 3.35.0
**Modules:** 185 → 188 (+3)
**Tests:** 4119 → 4191 (+72)
**Audit:** 183 PASS → 186 PASS (+3)

## Modules added

| # | Module | Functions | Tests |
|---|---|---|---|
| 1 | `psych_ext2` | Depression, Anxiety, Bipolar, PTSD, Substance, Schizophrenia, ADHD, Autism, Eating, Personality | 10 unit + 14 integ |
| 2 | `onco_ext3` | Staging, Chemo, Radiation, Target, Immuno, Surgery, Complication, Survivorship, Palliative, Screening | 10 unit + 14 integ |
| 3 | `repro_ext` | Infertility, ART, PCOS, Endometriosis, Fibroids, Contraception, Menopause, STI, Sexual, Preconception | 10 unit + 14 integ |

## Per-module structure (5 files each)

1. `*_engine.js` — 10 pure deterministic functions
2. `*_test.js` — 10 `it()` blocks
3. `*_integration_test.js` — makeDb shim + 14 assertions (4 DB ops + 10 engine)
4. `*_routes.js` — `/list`, `/call/:fn`, `/record`
5. `migrations/p3bw_3350_<module>_up.sql` — `p3bw_<module>` table + 2 indexes

## Generator

`pcc\gen_p3bw.py` — 1 SQL package + 3 module SQL + 3 integ + 3 routes, version `3.35.0`.

## Server

- v3.35.0 (was 3.34.0)
- 188 modules wired
- New endpoints: `/api/v1/psych-ext2`, `/api/v1/onco-ext3`, `/api/v1/repro-ext`

## Verification

- All 30 unit tests pass (10/10 per module)
- All 42 integration tests pass (14/14 per module)
- 3 endpoints verified via `Invoke-WebRequest http://localhost:3101/api/v1/.../list`
- Health endpoint reports v3.35.0 and 188 modules
- Audit: 186 PASS, 0 FAIL
- Test runner: 4191 total tests (2407 unit + 1784 integ)
