# SHIP P3-DT — v3.84.0

**Date:** 2026-07-27
**Phase:** P3-DT
**Version:** 3.84.0
**Modules shipped:** 3

## Modules

| Module | Label | Route |
|---|---|---|
| `pcc_chest_pain_unit` | PCC Chest Pain Unit | `/api/v1/pcc-chest-pain-unit` |
| `pcc_psych_emergency` | PCC Psych Emergency | `/api/v1/pcc-psych-emergency` |
| `pcc_trauma_center_l2` | PCC Trauma Center L2 | `/api/v1/pcc-trauma-center-l2` |

## Files created

- `pcc/gen_p3dt.py`
- `pcc/pcc_chest_pain_unit/pcc_chest_pain_unit_engine.js`
- `pcc/pcc_chest_pain_unit/pcc_chest_pain_unit_test.js`
- `pcc/pcc_chest_pain_unit/pcc_chest_pain_unit_integration_test.js`
- `pcc/pcc_chest_pain_unit/pcc_chest_pain_unit_routes.js`
- `pcc/pcc_psych_emergency/pcc_psych_emergency_engine.js`
- `pcc/pcc_psych_emergency/pcc_psych_emergency_test.js`
- `pcc/pcc_psych_emergency/pcc_psych_emergency_integration_test.js`
- `pcc/pcc_psych_emergency/pcc_psych_emergency_routes.js`
- `pcc/pcc_trauma_center_l2/pcc_trauma_center_l2_engine.js`
- `pcc/pcc_trauma_center_l2/pcc_trauma_center_l2_test.js`
- `pcc/pcc_trauma_center_l2/pcc_trauma_center_l2_integration_test.js`
- `pcc/pcc_trauma_center_l2/pcc_trauma_center_l2_routes.js`
- `pcc/migrations/p3dt_package_up.sql`
- `pcc/migrations/p3dt_pcc_chest_pain_unit_up.sql`
- `pcc/migrations/p3dt_pcc_psych_emergency_up.sql`
- `pcc/migrations/p3dt_pcc_trauma_center_l2_up.sql`
- `scratch/fix_server_p3dt.py`
- `scratch/fix_audit_runner_p3dt.py`

## Files modified

- `pcc/server.js` — version bumped to 3.84.0, 3 new routers wired
- `scratch/audit_all.py` — 3 new modules added to audit list
- `scratch/p3_temp_scripts/test_runner.py` — 6 new test entries added

## Verification

- Unit tests: 30 passed, 0 failed
- Integration tests: 42 passed, 0 failed
- Local server `/health` returns `3.84.0`
- `/list` endpoints return correct functions for all 3 modules
- `/call` and `/record` endpoints respond correctly
- `audit_all.py`: 333 PASS, 0 FAIL
- `test_runner.py`: UNIT 3355, INTEG 3856, TOTAL 7211

## Safety rails

- No hardcoded secrets
- No PHI in fixtures
- No DROP/DELETE in migrations
- `tenant_id NOT NULL` in every table
- Auth middleware referenced in routes
- Unit + integration tests present and passing

## Deployment status

Pending live redeploy to Hetzner.
