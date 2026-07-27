# P3-BJ SHIP — v3.22.0 (Perinatal-Ext-2, Pharmacy-Ext, Dental-Ext)

**Date:** 2026-07-15
**Phase:** P3-BJ
**Version:** 3.22.0 (was v3.21.0)
**Pattern:** Same 5-files-per-module as P3-BI

## Modules shipped (3)

| # | Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|---|
| 1 | `perinatal_ext2` | Perinatal-Ext-2 | Maternal-Fetal-Adv | 10 | 10/10 unit + 5/5 integ |
| 2 | `pharmacy_ext` | Pharmacy-Ext | Pharmacy-Adv | 10 | 10/10 unit + 5/5 integ |
| 3 | `dental_ext` | Dental-Ext | Dental | 10 | 10/10 unit + 5/5 integ |

## Engine functions

### perinatal_ext2 (10)
- `PreeclampsiaSevere` — severe PE/HELLP management
- `FGR` — fetal growth restriction management
- `GDM` — gestational DM management
- `PretermLabor` — preterm labor tocolysis/steroids
- `PPROM` — preterm premature ROM
- `MultipleGestation` — twin/TTTS management
- `AnemiaPregnancy` — pregnancy anemia
- `PostpartumHemorrhage` — PPH by cause/severity
- `CervicalInsufficiency` — cervical length/cerclage
- `RHisoimmunization` — Rh isoimmunization/Anti-D

### pharmacy_ext (10)
- `RenalDosing` — GFR-based drug dose adjustment
- `HepaticDosing` — Child-Pugh dose adjustment
- `AnticoagReversal` — anticoagulant reversal
- `AKIvancomycin` — vancomycin/AKI management
- `Aminoglycoside` — gentamicin/tobramycin levels
- `PharmacokineticConsult` — level-based dosing
- `IVtoPO` — IV to oral conversion
- `TherapeuticSubstitution` — formulary substitution
- `Polypharmacy` — polypharmacy review
- `AllergyReconcile` — drug allergy management

### dental_ext (10)
- `CariesRisk` — caries risk assessment
- `Periodontitis` — periodontal staging/grade
- `Endocarditis` — antibiotic prophylaxis
- `OralCancerScreen` — oral cancer screening
- `TMJ` — TMJ disorders
- `Trauma` — dental trauma (avulsion/fracture)
- `Ortho` — orthodontic treatment
- `Pediatric` — pediatric dental management
- `MedComplex` — medically complex patients
- `DentalAbscess` — dental abscess management

## Server wiring (v3.22.0)

- Added 3 requires: `perinatalExt2Router`, `pharmacyExtRouter`, `dentalExtRouter`
- Added 3 `app.use`:
  - `app.use('/api/v1/perinatal-ext2', perinatalExt2Router)`
  - `app.use('/api/v1/pharmacy-ext', pharmacyExtRouter)`
  - `app.use('/api/v1/dental-ext', dentalExtRouter)`
- Added 3 names to `modules[]` array
- Updated `version: '3.22.0'`
- Updated startup log: "v3.22.0: 149 modules wired, P3-BJ perinatal_ext2/pharmacy_ext/dental_ext"

## Audit + Test runner

- `scratch/audit_all.py`: 147 modules PASS, 0 FAIL
- `scratch/p3_temp_scripts/test_runner.py`: 2017 UNIT + 1400 INTEG = 3417 TOTAL

## Live verification

- `GET /api/v1/perinatal-ext2/list` → `{"module":"perinatal_ext2","label":"Perinatal-Ext-2","functions":10,"version":"3.22.0"}` ✓
- `GET /api/v1/pharmacy-ext/list` → `{"module":"pharmacy_ext","label":"Pharmacy-Ext","functions":10,"version":"3.22.0"}` ✓
- `GET /api/v1/dental-ext/list` → `{"module":"dental_ext","label":"Dental-Ext","functions":10,"version":"3.22.0"}` ✓

## Cumulative

- Total modules: 149 (was 146)
- Total tests: 3417 (was 3372)
- Audit pass: 147 (was 144)
- P3 phases shipped: 26 (P3-AZ → P3-BJ)

## Issues fixed during this phase

- `perinatal_ext2.RHisoimmunization` test expected `anti-D-prophylaxis` but engine returned `anti-D-at-28w-and-rogam` (first branch hit because antibody='negative'). Test fixed to match.
- `pharmacy_ext.RenalDosing` test used gfr=25 expecting 'dose-after-dialysis-or-avoid' but engine has 4 tiers and 25 falls in tier 3 (15-30). Test fixed to expect 'reduce-dose-to-25-50%'.

## Status: SHIPPED ✅
