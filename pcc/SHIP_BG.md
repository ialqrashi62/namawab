# P3-BG SHIP — v3.19.0 (Transplant-Immunology, Mens-Health-Ext, Palliative-Ext-2)

**Date:** 2026-07-15
**Phase:** P3-BG
**Version:** 3.19.0 (was v3.18.0)
**Pattern:** Same 5-files-per-module as P3-BF

## Modules shipped (3)

| # | Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|---|
| 1 | `transplant_immunology` | Transplant-Immunology | Transplant-Imm | 10 | 10/10 unit + 5/5 integ |
| 2 | `mens_health_ext` | Mens-Health-Ext | Mens-Health | 10 | 10/10 unit + 5/5 integ |
| 3 | `palliative_ext2` | Palliative-Ext-2 | Palliative | 10 | 10/10 unit + 5/5 integ |

## Engine functions

### transplant_immunology (10)
- `ABOMatch` — ABO compatibility check
- `Crossmatch` — T/B cell crossmatch interpretation
- `DSAPanel` — donor-specific antibody risk
- `InductionProtocol` — risk/age/organ-banded induction
- `MaintenanceIS` — time/renal/rejection-based IS taper
- `RejectionAcute` — Banff-grade acute rejection treatment
- `RejectionChronic` — chronic allograft dysfunction
- `DSAmonitor` — DSA monitoring frequency and triggers
- `InfectionProphylaxis` — organ-specific infection prophylaxis
- `VaccinationSchedule` — pre/post-transplant vaccines

### mens_health_ext (10)
- `WellMan` — annual well-man screening by age
- `Testosterone` — total/free T, symptoms-based TRT
- `ErectileDysfunction` — ED workup with CV risk gate
- `ProstateScreen` — PSA/family-history shared decision
- `BPH` — IPSS-based treatment
- `Hypogonadism` — primary vs secondary hypogonadism
- `InfertilityMale` — semen analysis classification
- `STI` — STI treatment including HIV urgent referral
- `HairLoss` — androgenetic/alopecia evaluation
- `MentalHealthMale` — PHQ9/GAD7 with suicide screening

### palliative_ext2 (10)
- `SymptomBurden` — composite pain/dyspnea/fatigue/nausea score
- `PrognosisEst` — ECOG/albumin/delirium-based prognosis
- `AdvanceDirective` — code status + proxy + wishes
- `HospiceEval` — eligibility check
- `PainRefractory` — opioid/adjuvant/SE-based escalation
- `DyspneaMgmt` — oxygen/anxiety/cause-based dyspnea plan
- `DeliriumTerminal` — terminal delirium management
- `NutritionHydration` — intake/prognosis/wishes-based nutrition
- `GriefBereavement` — grief stage/duration-based support
- `CaregiverBurnout` — caregiver hours/stress-based respite

## Server wiring (v3.19.0)

- Added 3 requires: `transplantImmunologyRouter`, `mensHealthExtRouter`, `palliativeExt2Router`
- Added 3 `app.use`:
  - `app.use('/api/v1/transplant-immunology', transplantImmunologyRouter)`
  - `app.use('/api/v1/mens-health-ext', mensHealthExtRouter)`
  - `app.use('/api/v1/palliative-ext2', palliativeExt2Router)`
- Added 3 names to `modules[]` array
- Updated `version: '3.19.0'`
- Updated startup log: "v3.19.0: 140 modules wired, P3-BG transplant_immunology/mens_health_ext/palliative_ext2"

## Audit + Test runner

- `scratch/audit_all.py`: 138 modules PASS, 0 FAIL
- `scratch/p3_temp_scripts/test_runner.py`: 1927 UNIT + 1355 INTEG = 3282 TOTAL

## Live verification

- `GET /api/v1/transplant-immunology/list` → `{"module":"transplant_immunology","label":"Transplant-Immunology","functions":10,"version":"3.19.0"}` ✓
- `GET /api/v1/mens-health-ext/list` → `{"module":"mens_health_ext","label":"Mens-Health-Ext","functions":10,"version":"3.19.0"}` ✓
- `GET /api/v1/palliative-ext2/list` → `{"module":"palliative_ext2","label":"Palliative-Ext-2","functions":10,"version":"3.19.0"}` ✓

## Cumulative

- Total modules: 140 (was 137)
- Total tests: 3282 (was 3237)
- Audit pass: 138 (was 135)
- P3 phases shipped: 23 (P3-AZ → P3-BG)

## Issues fixed during this phase

- `palliative_ext2.DyspneaMgmt` test initially used `oxygen: 'yes', anxiety: 'severe'` → engine hits `opiate-and-anxiolytic-and-blow-fan` first. Fixed by changing test to `oxygen: 'no', anxiety: 'mild', cause: 'CHF'` to hit the `diuresis-and-morphine` branch.

## Status: SHIPPED ✅
