# SHIP P3-DU — v3.85.0

**Date:** 2026-07-27
**Phase:** P3-DU
**Version:** 3.85.0
**Modules shipped:** 3

## Modules

| Module | Label | Route |
|---|---|---|
| `pcc_neonatal_icu` | PCC Neonatal ICU | `/api/v1/pcc-neonatal-icu` |
| `pcc_pain_procedure_suite` | PCC Pain Procedure Suite | `/api/v1/pcc-pain-procedure-suite` |
| `pcc_ortho_sports_surgery` | PCC Ortho Sports Surgery | `/api/v1/pcc-ortho-sports-surgery` |

## Files created

- `pcc/gen_p3du.py`
- 3 module dirs × 4 files (engine, test, integration_test, routes)
- 4 migrations (1 package + 3 module)
- `scratch/fix_server_p3du.py`
- `scratch/fix_audit_runner_p3du.py`

## Files modified

- `pcc/server.js` — version bumped to 3.85.0, 3 new routers wired
- `scratch/audit_all.py` — 3 new modules added
- `scratch/p3_temp_scripts/test_runner.py` — 6 new test entries added

## Verification

- Unit tests: 30 passed, 0 failed
- Integration tests: 42 passed, 0 failed
- Local `/health` returns `3.85.0`
- `audit_all.py`: 336 PASS, 0 FAIL
- `test_runner.py`: TOTAL 7253

## Safety rails

- All safety rails honored
- tenant_id NOT NULL in all 3 tables
- No hardcoded secrets, no PHI, no DROP

## Deployment status

Pending live redeploy to Hetzner.