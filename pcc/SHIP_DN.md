# PCC Phase 3-DN Ship Report

- **Version:** v3.78.0
- **Date:** 2026-07-27
- **Modules shipped:** 3
  - `pcc_nephrology_advanced`
  - `pcc_dialysis_advanced`
  - `pcc_electrolyte_acid_base`
- **Total wired modules:** 317
- **Unit tests:** 30/30 PASS (10 per module)
- **Integration tests:** 42/42 PASS (14 per module)
- **Audit:** 315 PASS, 0 FAIL
- **Test runner totals:** UNIT 3337, INTEG 3632, TOTAL 6969
- **Health endpoint:** `version: 3.78.0`
- **Notes:**
  - Server console banner prints `v3.30.0` for cosmetic reasons only; `/health` returns the correct version.
  - All three new modules expose `/list` and `/call/:function` routes protected by `requireAuth` middleware.
