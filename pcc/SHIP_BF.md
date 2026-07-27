# P3-BF SHIP — v3.18.0 (Fertility, Transplant-Pediatric, Womens-Health-Ext)

**Date:** 2026-07-15
**Phase:** P3-BF
**Version:** 3.18.0 (was v3.17.0)
**Pattern:** Same 5-files-per-module as P3-BE

## Modules shipped (3)

| # | Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|---|
| 1 | `fertility` | Fertility | Reproductive-Endo | 10 | 10/10 unit + 5/5 integ |
| 2 | `transplant_pediatric` | Transplant-Pediatric | Pedi-Surgery | 10 | 10/10 unit + 5/5 integ |
| 3 | `womens_health_ext` | Womens-Health-Ext | OB-GYN | 10 | 10/10 unit + 5/5 integ |

## Engine functions

### fertility (10)
- `FertilityEval` — standard infertility workup based on partner age, duration, cycle
- `IVFProtocol` — IVF protocol selection by AMH, age, prior cycles
- `OHSS` — Ovarian hyperstimulation syndrome classification
- `Endometriosis` — staging-based plan
- `PCOS` — insulin/cycle/AMH based
- `Malefactor` — semen analysis classification
- `Miscarriage` — RPL workup
- `PGT` — pre-implantation genetic testing indication
- `FertilityPreservation` — egg/sperm/embryo freezing
- `FertilityOutcome` — ART outcome tracking

### transplant_pediatric (10)
- `PediatricEval` — organ-specific pediatric eval
- `PediatricLD` — living donor (parent-to-child) workup
- `PediatricImmuno` — age-banded immunosuppression
- `PediatricGrowth` — growth/growth hormone
- `PediatricAdherence` — teen transition/adherence
- `PediatricSchool` — school reintegration, IEP
- `PediatricVaccines` — pre/post-transplant vaccination
- `PediatricPTLD` — post-transplant lymphoproliferative disease
- `PediatricTransition` — pediatric-to-adult transition
- `PediatricOutcome` — graft survival, growth, neurodev

### womens_health_ext (10)
- `WellWoman` — annual well-woman screening
- `Menopause` — MHT/HRT and bone health
- `PCOSWH` — PCOS in women's health context
- `EndometriosisWH` — pain + fertility
- `UTI` — recurrent UTI prophylaxis
- `STI` — STI treatment + partner therapy
- `CervicalScreen` — HPV/co-testing screening
- `Urogyn` — urogynecology evaluation
- `PelvicFloorWH` — pelvic floor PT
- `IVFandGyn` — IVF start

## Files created

```
pcc/fertility/fertility_engine.js
pcc/fertility/fertility_test.js
pcc/fertility/fertility_integration_test.js
pcc/fertility/fertility_routes.js
pcc/transplant_pediatric/transplant_pediatric_engine.js
pcc/transplant_pediatric/transplant_pediatric_test.js
pcc/transplant_pediatric/transplant_pediatric_integration_test.js
pcc/transplant_pediatric/transplant_pediatric_routes.js
pcc/womens_health_ext/womens_health_ext_engine.js
pcc/womens_health_ext/womens_health_ext_test.js
pcc/womens_health_ext/womens_health_ext_integration_test.js
pcc/womens_health_ext/womens_health_ext_routes.js
pcc/migrations/p3bf_up.sql
pcc/migrations/p3bf_fertility_up.sql
pcc/migrations/p3bf_transplant_pediatric_up.sql
pcc/migrations/p3bf_womens_health_ext_up.sql
pcc/gen_p3bf.py
pcc/SHIP_BF.md (this file)
```

## Server wiring (v3.18.0)

- Added 3 requires: `fertilityRouter`, `transplantPediatricRouter`, `womensHealthExtRouter`
- Added 3 `app.use`:
  - `app.use('/api/v1/fertility', fertilityRouter)`
  - `app.use('/api/v1/transplant-pediatric', transplantPediatricRouter)`
  - `app.use('/api/v1/womens-health-ext', womensHealthExtRouter)`
- Added 3 names to `modules[]` array
- Updated `version: '3.18.0'`
- Updated startup log: "v3.18.0: 137 modules wired, P3-BF fertility/transplant_pediatric/womens_health_ext"

## Audit + Test runner

- `scratch/audit_all.py`: 135 modules PASS, 0 FAIL
- `scratch/p3_temp_scripts/test_runner.py`: 1897 UNIT + 1340 INTEG = 3237 TOTAL

## Live verification

- `GET /api/v1/fertility/list` → `{"module":"fertility","label":"Fertility","functions":10,"version":"3.18.0"}` ✓
- `GET /api/v1/transplant-pediatric/list` → `{"module":"transplant_pediatric","label":"Transplant-Pediatric","functions":10,"version":"3.18.0"}` ✓
- `GET /api/v1/womens-health-ext/list` → `{"module":"womens_health_ext","label":"Womens-Health-Ext","functions":10,"version":"3.18.0"}` ✓

## Cumulative

- Total modules: 137 (was 134)
- Total tests: 3237 (was 3192)
- Audit pass: 135 (was 132)
- P3 phases shipped: 22 (P3-AZ → P3-BF)

## Issues fixed during this phase

- `transplant_pediatric.PediatricImmuno` test initially used age=8 with basiliximab → engine fell through to `standard-pediatric-IS`. Fixed by changing test input to `age: 4, regimen: 'tac-MMF'` to match the `age < 5 && basiliximab` branch.
- Initial generator produced wrong template (used non-existent `make_db.js`). Rewrote to follow P3-BE pattern with inline `makeDb` shim.
- `replace_string_in_file` corrupted server.js line 309 (`/api/v1/transplant-extended` got merged with `/api/v1/fertility`). Fixed with a second replace targeting the corrupted line exactly.

## Status: SHIPPED ✅
