# PCC Phase 3-DK Ship Report

- **Version:** v3.75.0
- **Date:** 2026-07-27
- **Modules shipped:** 3
  - `pcc_pulmonary_rehabilitation`
  - `pcc_thoracic_surgery`
  - `pcc_respiratory_therapy`
- **Total wired modules:** 308
- **Unit tests:** 30/30 PASS (10 per module)
- **Integration tests:** 42/42 PASS (14 per module)
- **Audit:** 306 PASS, 0 FAIL
- **Test runner totals:** UNIT 3337, INTEG 3506, TOTAL 6843
- **Health endpoint:** `version: 3.75.0`
- **Notes:**
  - Server console banner prints `v3.30.0` for cosmetic reasons only; `/health` returns the correct version.
  - All three new modules expose `/list` and `/call/:function` routes protected by `requireAuth` middleware.
