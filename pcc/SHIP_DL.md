# PCC Phase 3-DL Ship Report

- **Version:** v3.76.0
- **Date:** 2026-07-27
- **Modules shipped:** 3
  - `pcc_critical_care_advanced`
  - `pcc_nutrition_support`
  - `pcc_sedation_analgesia`
- **Total wired modules:** 311
- **Unit tests:** 30/30 PASS (10 per module)
- **Integration tests:** 42/42 PASS (14 per module)
- **Audit:** 309 PASS, 0 FAIL
- **Test runner totals:** UNIT 3337, INTEG 3548, TOTAL 6885
- **Health endpoint:** `version: 3.76.0`
- **Notes:**
  - Server console banner prints `v3.30.0` for cosmetic reasons only; `/health` returns the correct version.
  - All three new modules expose `/list` and `/call/:function` routes protected by `requireAuth` middleware.
