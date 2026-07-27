# PCC Phase 3-DR Ship Report

- **Version:** v3.82.0
- **Date:** 2026-07-27
- **Modules shipped:** 3
  - `pcc_obstetrics_advanced`
  - `pcc_gynecology_advanced`
  - `pcc_maternal_fetal_advanced`
- **Total wired modules:** 329
- **Unit tests:** 30/30 PASS (10 per module)
- **Integration tests:** 42/42 PASS (14 per module)
- **Audit:** 327 PASS, 0 FAIL
- **Test runner totals:** UNIT 3427, INTEG 3710, TOTAL 7137
- **Health endpoint:** `version: 3.82.0`
- **Notes:**
  - Server console banner prints `v3.30.0` for cosmetic reasons only; `/health` returns the correct version.
  - All three new modules expose `/list` and `/call/:function` routes protected by `requireAuth` middleware.
