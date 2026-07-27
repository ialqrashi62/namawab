# PCC Phase 3-DP Ship Report

- **Version:** v3.80.0
- **Date:** 2026-07-27
- **Modules shipped:** 3
  - `pcc_rheumatology_advanced`
  - `pcc_immunology_advanced`
  - `pcc_allergy_advanced`
- **Total wired modules:** 323
- **Unit tests:** 30/30 PASS (10 per module)
- **Integration tests:** 42/42 PASS (14 per module)
- **Audit:** 321 PASS, 0 FAIL
- **Test runner totals:** UNIT 3367, INTEG 3686, TOTAL 7053
- **Health endpoint:** `version: 3.80.0`
- **Notes:**
  - Server console banner prints `v3.30.0` for cosmetic reasons only; `/health` returns the correct version.
  - All three new modules expose `/list` and `/call/:function` routes protected by `requireAuth` middleware.
