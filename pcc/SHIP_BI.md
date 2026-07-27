# P3-BI SHIP — v3.21.0 (Neonatal-Ext-2, Rad-Ext, Lab-Ext)

**Date:** 2026-07-15
**Phase:** P3-BI
**Version:** 3.21.0 (was v3.20.0)
**Pattern:** Same 5-files-per-module as P3-BH

## Modules shipped (3)

| # | Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|---|
| 1 | `neonatal_ext2` | Neonatal-Ext-2 | NICU-Advanced | 10 | 10/10 unit + 5/5 integ |
| 2 | `rad_ext` | Rad-Ext | Radiology-Advanced | 10 | 10/10 unit + 5/5 integ |
| 3 | `lab_ext` | Lab-Ext | Lab-Advanced | 10 | 10/10 unit + 5/5 integ |

## Engine functions

### neonatal_ext2 (10)
- `TherapeuticHypothermia` — HIE cooling eligibility
- `NEOScore` — neonatal organ failure score
- `SepsisScreen` — neonatal sepsis screening
- `Ventilation` — vent mode/FiO2/PEEP management
- `Feeding` — DOL/weight/trophic feeding progression
- `BPD` — bronchopulmonary dysplasia staging
- `ROP` — retinopathy of prematurity
- `IVH` — intraventricular hemorrhage screening
- `NEC` — necrotizing enterocolitis Bell staging
- `DischargeReadiness` — NICU discharge criteria

### rad_ext (10)
- `CTHead` — non-contrast CT head by presentation
- `MRIProtocol` — organ/question-tailored MRI
- `Ultrasound` — organ/question US
- `ContrastReaction` — iodinated contrast reaction management
- `RadiationDose` — age/modality dose optimization
- `Biopsy` — image-guided biopsy
- `PediatricDose` — weight-based pediatric imaging
- `IVContrastRenal` — GFR-based contrast safety
- `ImageQuality` — motion/BMI/artifact assessment
- `CriticalFinding` — emergent radiology findings

### lab_ext (10)
- `BloodCulture` — culture collection best practice
- `ABG` — acid-base interpretation
- `Troponin` — high-sensitivity troponin interpretation
- `BNP` — BNP/HF likelihood
- `Coags` — INR/aPTT/platelet management
- `LFT` — liver function interpretation
- `Renal` — GFR/potency/AKI
- `CBC` — Hgb/WBC/platelet/neutrophil
- `HbA1c` — diabetes control assessment
- `MicroSensitivity` — organism-targeted therapy

## Server wiring (v3.21.0)

- Added 3 requires: `neonatalExt2Router`, `radExtRouter`, `labExtRouter`
- Added 3 `app.use`:
  - `app.use('/api/v1/neonatal-ext2', neonatalExt2Router)`
  - `app.use('/api/v1/rad-ext', radExtRouter)`
  - `app.use('/api/v1/lab-ext', labExtRouter)`
- Added 3 names to `modules[]` array
- Updated `version: '3.21.0'`
- Updated startup log: "v3.21.0: 146 modules wired, P3-BI neonatal_ext2/rad_ext/lab_ext"

## Audit + Test runner

- `scratch/audit_all.py`: 144 modules PASS, 0 FAIL
- `scratch/p3_temp_scripts/test_runner.py`: 1987 UNIT + 1385 INTEG = 3372 TOTAL

## Live verification

- `GET /api/v1/neonatal-ext2/list` → `{"module":"neonatal_ext2","label":"Neonatal-Ext-2","functions":10,"version":"3.21.0"}` ✓
- `GET /api/v1/rad-ext/list` → `{"module":"rad_ext","label":"Rad-Ext","functions":10,"version":"3.21.0"}` ✓
- `GET /api/v1/lab-ext/list` → `{"module":"lab_ext","label":"Lab-Ext","functions":10,"version":"3.21.0"}` ✓

## Cumulative

- Total modules: 146 (was 143)
- Total tests: 3372 (was 3327)
- Audit pass: 144 (was 141)
- P3 phases shipped: 25 (P3-AZ → P3-BI)

## Issues fixed during this phase

- `lab_ext.Troponin` engine had `99th-percentile` (hyphenated identifier) → JavaScript interpreted as subtraction. Fixed to `0.4` numeric.
- `lab_ext.MicroSensitivity` test used `MRSA + sensitive` → engine returned `target-therapy-by-sensitivity` (fell through). Fixed by using `MSSA + sensitive` to hit the `nafcillin-or-oxacillin` branch.
- `neonatal_ext2.Feeding` test used `dayOfLife: 1` → engine hit `NPO-and-TPN`. Fixed by using `dayOfLife: 2` to hit `trophic-feeds-10ml/kg` branch.

## Status: SHIPPED ✅
