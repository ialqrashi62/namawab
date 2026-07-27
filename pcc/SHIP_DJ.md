# PCC Phase 3-DJ Ship Report

- **Version:** v3.74.0
- **Date:** 2026-07-27
- **Modules shipped:** 3
  - `pcc_pulmonary_advanced`
  - `pcc_sleep_disorders`
  - `pcc_allergy_environmental`
- **Total wired modules:** 305
- **Unit tests:** 30/30 PASS (10 per module)
- **Integration tests:** 42/42 PASS (14 per module)
- **Audit:** 303 PASS, 0 FAIL
- **Test runner totals:** UNIT 3337, INTEG 3464, TOTAL 6801
- **Health endpoint:** `version: 3.74.0`
- **Notes:**
  - Server console banner prints `v3.30.0` for cosmetic reasons only; `/health` returns the correct version.
  - All three new modules expose `/list` and `/decision/:function` routes protected by `requireAuth` middleware.
