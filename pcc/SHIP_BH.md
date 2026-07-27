# P3-BH SHIP — v3.20.0 (Transplant-Pharmacy, Neuro-Ext-2, CV-Ext-2)

**Date:** 2026-07-15
**Phase:** P3-BH
**Version:** 3.20.0 (was v3.19.0)
**Pattern:** Same 5-files-per-module as P3-BG

## Modules shipped (3)

| # | Module | Label | Parent | Functions | Tests |
|---|---|---|---|---|---|
| 1 | `transplant_pharmacy` | Transplant-Pharmacy | Transplant-Pharm | 10 | 10/10 unit + 5/5 integ |
| 2 | `neuro_ext2` | Neuro-Ext-2 | Neuro | 10 | 10/10 unit + 5/5 integ |
| 3 | `cv_ext2` | CV-Ext-2 | Cardiology | 10 | 10/10 unit + 5/5 integ |

## Engine functions

### transplant_pharmacy (10)
- `TacLevel` — time-banded tac target range
- `MMFDose` — MMF dose by WBC/ANC/GI tolerance
- `SteroidTaper` — prednisone taper over time
- `ValcyteCMV` — CMV serostatus-based valganciclovir
- `BactrimPCP` — PCP prophylaxis 12mo
- `Antifungal` — organ/risk-based antifungal
- `DrugInteraction` — CYP-statin interactions
- `AdherenceMonitor` — missed dose rate monitoring
- `SideEffectMgmt` — IS side effect management
- `TherapeuticDrugMonitor` — drug level monitoring schedule

### neuro_ext2 (10)
- `StrokeTriage` — tPA/thrombectomy eligibility
- `Migraine` — preventive vs acute therapy
- `Seizure` — first seizure, status epilepticus, optimization
- `Parkinsons` — age/H&Y based treatment
- `MSRelapse` — DMT escalation
- `DementiaEval` — MMSE/MoCA/onset-based
- `GBS` — Guillain-Barre ICU/IVIG
- `Myasthenia` — myasthenic crisis management
- `Neuropathy` — diabetic/CIDP/B12
- `BrainTumor` — resection vs SRS

### cv_ext2 (10)
- `ACS` — STEMI/NSTEMI/UA risk stratification
- `HeartFailure` — HFrEF/HFpEF GDMT
- `Arrhythmia` — ACLS, SVT, AF management
- `ValveDisease` — AS/MR severity + symptoms
- `Hypertension` — JNC/ACC-AHA based targets
- `Anticoagulation` — DOAC/warfarin/CHA2DS2-VASc
- `LipidMgmt` — LDL/risk-based statin
- `PAD` — ABI-based PAD management
- `Cardiomyopathy` — ischemic vs non-ischemic
- `Pericardial` — effusion/tamponade/constriction

## Server wiring (v3.20.0)

- Added 3 requires: `transplantPharmacyRouter`, `neuroExt2Router`, `cvExt2Router`
- Added 3 `app.use`:
  - `app.use('/api/v1/transplant-pharmacy', transplantPharmacyRouter)`
  - `app.use('/api/v1/neuro-ext2', neuroExt2Router)`
  - `app.use('/api/v1/cv-ext2', cvExt2Router)`
- Added 3 names to `modules[]` array
- Updated `version: '3.20.0'`
- Updated startup log: "v3.20.0: 143 modules wired, P3-BH transplant_pharmacy/neuro_ext2/cv_ext2"

## Audit + Test runner

- `scratch/audit_all.py`: 141 modules PASS, 0 FAIL
- `scratch/p3_temp_scripts/test_runner.py`: 1957 UNIT + 1370 INTEG = 3327 TOTAL

## Live verification

- `GET /api/v1/transplant-pharmacy/list` → `{"module":"transplant_pharmacy","label":"Transplant-Pharmacy","functions":10,"version":"3.20.0"}` ✓
- `GET /api/v1/neuro-ext2/list` → `{"module":"neuro_ext2","label":"Neuro-Ext-2","functions":10,"version":"3.20.0"}` ✓
- `GET /api/v1/cv-ext2/list` → `{"module":"cv_ext2","label":"CV-Ext-2","functions":10,"version":"3.20.0"}` ✓

## Cumulative

- Total modules: 143 (was 140)
- Total tests: 3327 (was 3282)
- Audit pass: 141 (was 138)
- P3 phases shipped: 24 (P3-AZ → P3-BH)

## Issues fixed during this phase

- `cv_ext2.Cardiomyopathy` test initially used `ef: 30, cause: 'ischemic'` → engine hit the generic `ef < 35` branch first. Fixed by setting `ef: 20` to clearly fall under `< 30` ischemic branch.
- Server restart was performed BEFORE version field was updated. Health endpoint returned `3.19.0` for the first restart. Fixed by performing a second restart after the version field update.

## Status: SHIPPED ✅
