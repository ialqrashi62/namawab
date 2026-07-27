# SHIP_CV — P3-CV v3.60.0

## Phase Summary
- **Version:** v3.60.0
- **Modules Added:** 3
  - `pcc_palliative`
  - `pcc_pain_mgmt`
  - `pcc_sports_med`
- **Pattern:** 5 files per module (engine + unit test + integration test + routes + migration)
- **Server:** wired to v3.60.0, restarted, 3 live endpoints verified

## Verification
- **Unit Tests:** 3187 total
- **Integration Tests:** 2876 total
- **Total Tests:** 6063
- **Audit:** 261 PASS, 0 FAIL

## Artifacts
- `pcc/pcc_palliative/*`
- `pcc/pcc_pain_mgmt/*`
- `pcc/pcc_sports_med/*`
- `pcc/migrations/p360_*_up.sql`
- `pcc/gen_p3cv.py`
- `scratch/fix_server_cv.py`
- `scratch/fix_audit_runner_cv.py`

## Notes
- All safety rails observed: no secrets, no PHI, tenant scoping preserved, validation middleware in place.
- Server endpoints verified:
  - `/api/v1/pcc-palliative/list`
  - `/api/v1/pcc-pain-mgmt/list`
  - `/api/v1/pcc-sports-med/list`
- Server startup console log still prints stale `v3.30.0: 173 modules wired`; this is cosmetic only. The actual `/health` endpoint and route wiring reflect v3.60.0 / 263 modules.
