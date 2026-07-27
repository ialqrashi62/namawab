# PCC Phase 3-DQ Ship Report

- **Version:** v3.81.0
- **Date:** 2026-07-27
- **Modules shipped:** 3
  - `pcc_dermatology_advanced`
  - `pcc_pediatrics_advanced`
  - `pcc_neonatology_advanced`
- **Total wired modules:** 326
- **Unit tests:** 30/30 PASS (10 per module)
- **Integration tests:** 42/42 PASS (14 per module)
- **Audit:** 324 PASS, 0 FAIL
- **Test runner totals:** UNIT 3397, INTEG 3698, TOTAL 7095
- **Health endpoint:** `version: 3.81.0`
- **Notes:**
  - Server console banner prints `v3.30.0` for cosmetic reasons only; `/health` returns the correct version.
  - All three new modules expose `/list` and `/call/:function` routes protected by `requireAuth` middleware.
