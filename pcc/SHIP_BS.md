# SHIP_BS — P3-BS v3.31.0

**Date:** 2026-07-25
**Phase:** P3-BS (3 modules)
**Version:** 3.30.0 → 3.31.0
**Modules:** 173 → 176 (+3)
**Tests:** 3831 → 3903 (+72)
**Audit:** 171 PASS → 174 PASS (+3)

## Modules added

| # | Module | Functions | Tests |
|---|---|---|---|
| 1 | `geri_ext` | Frailty, Polypharm, Delirium, Falls, Dementia, Nutrition, PressureUlcer, Depression, Advance, Sarcopenia | 10 unit + 14 integ |
| 2 | `gen_med_ext` | Triage, Sepsis, ChestPain, ShortBreath, AbdPain, Fever, Syncope, BackPain, Headache, Dizzy | 10 unit + 14 integ |
| 3 | `trauma_ext` | Triage, Primary, Secondary, FAST, Head, Chest, Abdomen, Pelvis, Spine, MTP | 10 unit + 14 integ |

## Per-module structure (5 files each)

1. `*_engine.js` — 10 pure deterministic functions
2. `*_test.js` — 10 `it()` blocks
3. `*_integration_test.js` — makeDb shim + 14 assertions (4 DB ops + 10 engine)
4. `*_routes.js` — `/list`, `/call/:fn`, `/record`
5. `migrations/p3bs_3310_<module>_up.sql` — `p3bs_<module>` table + 2 indexes

## Generator

`pcc\gen_p3bs.py` — 1 SQL package + 3 module SQL + 3 integ + 3 routes, version `3.31.0`.

## Server

- v3.31.0 (was 3.30.0)
- 176 modules wired
- New endpoints: `/api/v1/geri-ext`, `/api/v1/gen-med-ext`, `/api/v1/trauma-ext`

## Verification

- All 30 unit tests pass (10/10 per module)
- All 42 integration tests pass (14/14 per module)
- 3 endpoints verified via `Invoke-WebRequest http://localhost:3101/api/v1/.../list`
- Health endpoint reports v3.31.0 and 176 modules
- Audit: 174 PASS, 0 FAIL
- Test runner: 3903 total tests (2287 unit + 1616 integ)
