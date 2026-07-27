# SHIP_BY — P3-BY v3.37.0

**Date:** 2026-07-25
**Phase:** P3-BY (3 modules)
**Version:** 3.36.0 → 3.37.0
**Modules:** 191 → 194 (+3)
**Tests:** 4263 → 4335 (+72)
**Audit:** 189 PASS → 192 PASS (+3)

## Modules added

| # | Module | Functions | Tests |
|---|---|---|---|
| 1 | `allergy_ext2` | Rhinitis, Asthma, Food, Drug, Urticaria, Anaphylaxis, Sting, Eczema, Contact, AIT | 10 unit + 14 integ |
| 2 | `cv_ext3` | Stroke, TIA, SAH, Aneurysm, AVM, Carotid, ICP, Seizure, MS, Park | 10 unit + 14 integ |
| 3 | `sleep_ext2` | Insomnia, OSA, RLS, Narcolepsy, Parasomnia, Circadian, CPAP, Daytime, Pediatric, SleepStudy | 10 unit + 14 integ |

## Per-module structure (5 files each)

1. `*_engine.js` — 10 pure deterministic functions
2. `*_test.js` — 10 `it()` blocks
3. `*_integration_test.js` — makeDb shim + 14 assertions (4 DB ops + 10 engine)
4. `*_routes.js` — `/list`, `/call/:fn`, `/record`
5. `migrations/p3by_3370_<module>_up.sql` — `p3by_<module>` table + 2 indexes

## Generator

`pcc\gen_p3by.py` — 1 SQL package + 3 module SQL + 3 integ + 3 routes, version `3.37.0`.

## Server

- v3.37.0 (was 3.36.0)
- 194 modules wired
- New endpoints: `/api/v1/allergy-ext2`, `/api/v1/cv-ext3`, `/api/v1/sleep-ext2`

## Verification

- All 30 unit tests pass (10/10 per module)
- All 42 integration tests pass (14/14 per module)
- 3 endpoints verified via `Invoke-WebRequest http://localhost:3101/api/v1/.../list`
- Health endpoint reports v3.37.0 and 194 modules
- Audit: 192 PASS, 0 FAIL
- Test runner: 4335 total tests (2467 unit + 1868 integ)
