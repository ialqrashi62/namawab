# P3-BM SHIP — v3.25.0 (Ophth-Ext, Hem-Ext, Onco-Ext-2)

**Date:** 2026-07-15
**Phase:** P3-BM
**Version:** 3.25.0 (was v3.24.0)
**Pattern:** Same 5-files-per-module as P3-BL

## Modules shipped (3)

| # | Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|---|
| 1 | `ophth_ext` | Ophth-Ext | Ophthalmology | 10 | 10/10 unit + 5/5 integ |
| 2 | `hem_ext` | Hem-Ext | Hematology | 10 | 10/10 unit + 5/5 integ |
| 3 | `onco_ext2` | Onco-Ext-2 | Oncology-Advanced | 10 | 10/10 unit + 5/5 integ |

## Engine functions

### ophth_ext (10)
- `Glaucoma` — IOP/optic nerve/VF
- `DiabeticRetinopathy` — DR staging + edema
- `MacularDegeneration` — wet/dry AMD
- `Cataract` — visual acuity/activity
- `Conjunctivitis` — bacterial/viral/allergic
- `Uveitis` — location/chronicity
- `RetinalDetach` — RD type/macula
- `CornealAbrasion` — size/contact lens
- `Strabismus` — age/type/binocular
- `EyeTrauma` — type/globe status

### hem_ext (10)
- `AnemiaWorkup` — MCV/retic/ferritin
- `SickleCell` — crisis type/Hgb
- `DVT` — Wells/d-dimer
- `AnticoagClinic` — warfarin/DOAC
- `Thrombocytopenia` — plt/bleed/cause
- `Neutropenia` — ANC/fever
- `Transfusion` — Hgb threshold
- `Hypercoagulable` — event/age/family
- `Myeloma` — CRAB criteria
- `BleedingDiath` — PTT/bleed/family

### onco_ext2 (10)
- `TNMStaging` — T/N/M staging
- `ChemoRegimen` — cancer-specific chemo
- `TumorResponse` — RECIST response
- `FebrileNeutropenia` — FN management
- `TumorLysis` — TLS prevention/treatment
- `OncEmergency` — SVC/SCC/hyperCa
- `Survivorship` — survivor follow-up
- `ClinicalTrial` — trial eligibility
- `Immunotherapy` — IO selection
- `TargetedTx` — mutation-targeted

## Server wiring (v3.25.0)

- Added 3 requires: `ophthExtRouter`, `hemExtRouter`, `oncoExt2Router`
- Added 3 `app.use`
- Added 3 names to `modules[]`
- Updated `version: '3.25.0'`
- Boot log: "v3.25.0: 158 modules wired, P3-BM ophth_ext/hem_ext/onco_ext2"

## Audit + Test runner

- Audit: 156 PASS, 0 FAIL
- Test runner: 2107 UNIT + 1445 INTEG = 3552 TOTAL

## Live verification

- `GET /api/v1/ophth-ext/list` → version 3.25.0 ✓
- `GET /api/v1/hem-ext/list` → version 3.25.0 ✓
- `GET /api/v1/onco-ext2/list` → version 3.25.0 ✓

## Cumulative

- Total modules: 158 (was 155)
- Total tests: 3552 (was 3507)
- Audit pass: 156 (was 153)
- P3 phases shipped: 29 (P3-AZ → P3-BM)

## Status: SHIPPED ✅
