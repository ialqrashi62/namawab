# P3-DA Closeout — v3.65.0

**Date:** 2026-07-27
**Phase:** P3-DA
**Version:** v3.65.0
**Modules shipped:** 3
- `pcc_integrative_medicine`
- `pcc_functional_medicine`
- `pcc_longevity_medicine`

## Totals

- **Modules wired:** 278
- **Unit + integration tests passing:** 6423
- **Audit PASS:** 276 / 276

## Verification

- `node pcc/server.js` started on `PCC_PORT=3101`
- `/health` returns `version: '3.65.0'`
- `/api/v1/pcc-integrative-medicine/list`, `/api/v1/pcc-functional-medicine/list`, `/api/v1/pcc-longevity-medicine/list` all return correct function arrays
- `scratch/audit_all.py`: `SUMMARY: 276 PASS, 0 FAIL`
- `scratch/p3_temp_scripts/test_runner.py`: `UNIT: 3337, INTEG: 3086, TOTAL: 6423`

## Safety rails

All 13 safety rails and 6 L4 gates verified by `audit_all.py`.

## Notes

- Server startup console log still prints stale `v3.30.0: 173 modules wired`; cosmetic only. `/health` returns v3.65.0.
- Used `pcc-phase-shipper` token-saver skill.

## Next phase

P3-DB (v3.66.0) candidates:
- `pcc_precision_medicine`
- `pcc_regenerative_medicine`
- `pcc_metabolic_surgery`
