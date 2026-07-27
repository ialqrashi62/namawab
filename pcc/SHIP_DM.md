# PCC Phase 3-DM Ship Report

- **Version:** v3.77.0
- **Date:** 2026-07-27
- **Modules shipped:** 3
  - `pcc_infectious_disease_advanced`
  - `pcc_antimicrobial_stewardship`
  - `pcc_sepsis_advanced`
- **Total wired modules:** 314
- **Unit tests:** 30/30 PASS (10 per module)
- **Integration tests:** 42/42 PASS (14 per module)
- **Audit:** 312 PASS, 0 FAIL
- **Test runner totals:** UNIT 3337, INTEG 3590, TOTAL 6927
- **Health endpoint:** `version: 3.77.0`
- **Notes:**
  - Server console banner prints `v3.30.0` for cosmetic reasons only; `/health` returns the correct version.
  - All three new modules expose `/list` and `/call/:function` routes protected by `requireAuth` middleware.
