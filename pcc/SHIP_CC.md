# SHIP_CC — P3-CC v3.41.0

**Date:** 2026-07-25
**Phase:** P3-CC (3 modules)
**Version:** 3.40.0 → 3.41.0
**Modules:** 203 → 206 (+3)
**Tests:** 4551 → 4623 (+72)
**Audit:** 201 PASS → 204 PASS (+3)

## Modules added

| # | Module | Functions | Tests |
|---|---|---|---|
| 1 | `pcc_decision` | Triage, Risk, Recommendation, Differential, Path, Severity, Outcome, FollowUp, Test, Therapy | 10 unit + 14 integ |
| 2 | `pcc_clinical_dx` | Differential, Workup, Imaging, Lab, Consult, Spec, FollowUp, Disposition, Pathway, Alert | 10 unit + 14 integ |
| 3 | `pcc_drug` | Dose, Interaction, Allergy, Renal, Hepatic, Level, Pregnancy, Route, Frequency, Duration | 10 unit + 14 integ |

## Per-module structure (5 files each)

1. `*_engine.js` — 10 pure deterministic functions
2. `*_test.js` — 10 `it()` blocks
3. `*_integration_test.js` — makeDb shim + 14 assertions (4 DB ops + 10 engine)
4. `*_routes.js` — `/list`, `/call/:fn`, `/record`
5. `migrations/p3cc_3410_<module>_up.sql` — `p3cc_<module>` table + 2 indexes

## Generator

`pcc\gen_p3cc.py` — 1 SQL package + 3 module SQL + 3 integ + 3 routes, version `3.41.0`.

## Server

- v3.41.0 (was 3.40.0)
- 206 modules wired
- New endpoints: `/api/v1/pcc-decision`, `/api/v1/pcc-clinical-dx`, `/api/v1/pcc-drug`

## Verification

- All 30 unit tests pass (10/10 per module)
- All 42 integration tests pass (14/14 per module)
- 3 endpoints verified via `Invoke-WebRequest http://localhost:3101/api/v1/.../list`
- Health endpoint reports v3.41.0 and 206 modules
- Audit: 204 PASS, 0 FAIL
- Test runner: 4623 total tests (2587 unit + 2036 integ)
