# Oncology & Hematology — Batch 1 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO Input

### Clinical Scope
- **Mission:** Medical onc + hematology + BMT + gyn-onc
- **Top 5:** C50.9 (Breast), C34.9 (Lung), C18.9 (Colon), C92.0 (AML), C85.9 (Lymphoma)
- **Care bundles:** Onc emergency bundle, neutropenic fever, tumor lysis
- **Red flags:** Neutropenic fever, brain mets, cord compression, SVC syndrome, hypercalcemia, tumor lysis

### Sub-units
1. Solid tumor clinics (each organ)
2. Hematologic malignancy
3. BMT (auto, allo, cord)
4. Gyn onc (joint OB)
5. Anticoagulation (joint cardio)
6. Survivorship clinic

## 2. AI Engineer

### Engines
- `tumor_staging_engine.js` (TNM, AJCC)
- `chemo_dose_engine.js` (BSA, renal/hepatic adjustment)
- `tumor_lysis_engine.js` (Cairo-Bishop)
- `coagulopathy_engine.js` (DIC score)
- `biomarker_engine.js` (PD-L1, MSI, BRCA interpretation)

## 3. Architect

### API
- POST `/api/onc/cds/tnm_stage`
- POST `/api/onc/cds/chemo_dose`
- POST `/api/onc/cds/biomarker_interpret`
- GET `/api/onc/cohorts/{organ}_stage_4`, `/bmt_eligible`

## 4. DevOps
- RLS, encrypted cancer staging
- Audit every chemo cycle (PHRAM-grade A)
- Genetic data (BRCA) doubly encrypted

## 5. PM/UX
- Sub-tabs: Solid, Hem, BMT, Gyn-onc, Survivorship
- Layout D for biomarker trend, chemo cycle tracking

## 6. Compliance
- CBAHI, JCI, NCCN/ASCO/ESMO, Saudi Oncology Society
- Chemo double-check (2 nurses + 1 pharmacist) per IPSG

## KPIs
1. Time to first treatment ≤30d ≥80%
2. BMT 100-day survival ≥85%
3. Oral chemo adherence ≥90%
4. Hospice referral appropriate ≥80%
5. Clinical trial enrollment ≥10% eligible

## New files (this batch)
- Synthesis
