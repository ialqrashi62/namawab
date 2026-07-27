# P3-BL SHIP — v3.24.0 (Occupational-Ext, Rehab-Ext-2, ENT-Ext)

**Date:** 2026-07-15
**Phase:** P3-BL
**Version:** 3.24.0 (was v3.23.0)
**Pattern:** Same 5-files-per-module as P3-BK

## Modules shipped (3)

| # | Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|---|
| 1 | `occupational_ext` | Occupational-Ext | Occupational-Health | 10 | 10/10 unit + 5/5 integ |
| 2 | `rehab_ext2` | Rehab-Ext-2 | Rehab-Advanced | 10 | 10/10 unit + 5/5 integ |
| 3 | `ent_ext` | ENT-Ext | ENT | 10 | 10/10 unit + 5/5 integ |

## Engine functions

### occupational_ext (10)
- `WorkInjury` — work-related injury management
- `FunctionalCapacity` — FCE demand/current/endurance
- `ReturnToWork` — RTW with restrictions/modified duty
- `Ergonomic` — ergonomic intervention
- `CumulativeTrauma` — CTD management
- `HearingLoss` — occupational hearing loss
- `VisionScreen` — vision screen for job
- `RespiratorFit` — respirator fit/medical clearance
- `DrugTest` — workplace drug testing
- `DisabilityRating` — disability rating

### rehab_ext2 (10)
- `StrokeRehab` — phase-based stroke rehab
- `TBIRehab` — TBI severity/days-based
- `SPInjury` — spinal cord injury by level
- `Amputee` — amputee prosthetic rehab
- `CardiacRehab` — cardiac rehab phase/mets
- `PulmonaryRehab` — pulmonary rehab FEV1/dyspnea
- `BurnRehab` — burn rehab by TBSA/contracture
- `JointRepl` — joint replacement day-based
- `PainRehab` — chronic pain rehab
- `ProstheticUse` — prosthetic hours/gait

### ent_ext (10)
- `HearingLoss` — hearing loss by type/severity
- `Vertigo` — BPPV/Meniere/central
- `Tinnitus` — tinnitus duration/unilateral
- `Sinusitis` — chronic/acute/polyps
- `OSA` — sleep apnea by AHI/BMI
- `Hoarseness` — hoarseness duration/smoker
- `Epistaxis` — nosebleed severity/posterior
- `Dysphagia` — swallowing by phase
- `Thyroid` — TSH/nodule workup
- `Otitis` — otitis media/effusion/CSOM

## Server wiring (v3.24.0)

- Added 3 requires: `occupationalExtRouter`, `rehabExt2Router`, `entExtRouter`
- Added 3 `app.use`:
  - `app.use('/api/v1/occupational-ext', occupationalExtRouter)`
  - `app.use('/api/v1/rehab-ext2', rehabExt2Router)`
  - `app.use('/api/v1/ent-ext', entExtRouter)`
- Added 3 names to `modules[]` array
- Updated `version: '3.24.0'`
- Updated startup log: "v3.24.0: 155 modules wired, P3-BL occupational_ext/rehab_ext2/ent_ext"

## Audit + Test runner

- `scratch/audit_all.py`: 153 modules PASS, 0 FAIL
- `scratch/p3_temp_scripts/test_runner.py`: 2077 UNIT + 1430 INTEG = 3507 TOTAL

## Live verification

- `GET /api/v1/occupational-ext/list` → `{"module":"occupational_ext","label":"Occupational-Ext","functions":10,"version":"3.24.0"}` ✓
- `GET /api/v1/rehab-ext2/list` → `{"module":"rehab_ext2","label":"Rehab-Ext-2","functions":10,"version":"3.24.0"}` ✓
- `GET /api/v1/ent-ext/list` → `{"module":"ent_ext","label":"ENT-Ext","functions":10,"version":"3.24.0"}` ✓

## Cumulative

- Total modules: 155 (was 152)
- Total tests: 3507 (was 3462)
- Audit pass: 153 (was 150)
- P3 phases shipped: 28 (P3-AZ → P3-BL)

## Issues fixed during this phase

- `rehab_ext2.StrokeRehab` engine had `const function` (JS reserved word) → syntax error. Renamed to `funcStatus`.

## Status: SHIPPED ✅
