# Pulmonology — Batch 1 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO Input

### Clinical Scope
- **Mission:** Respiratory + sleep + critical care lung
- **Top 5:** J45.909 (Asthma), J44.9 (COPD), G47.30 (Sleep apnea), J96.10 (Resp failure), J90 (Pleural effusion)
- **Care bundles:** COPD bundle (smoking cessation, vaccines, rehab, LTOT)
- **Red flags:** Severe asthma, tension pneumothorax, massive PE, resp failure

### Sub-units
1. Asthma clinic
2. COPD clinic
3. Sleep lab (polysomnography)
4. Bronchoscopy
5. Home O2 / Respiratory care
6. Allergic Pulmonology
7. ILD clinic
8. Pulmonary HTN clinic

## 2. AI Engineer

### Engines
- `copd_severity_engine.js` (GOLD, CAT)
- `asthma_control_engine.js` (ACT, GINA)
- `sleep_study_engine.js` (AHI, ODI)
- `pft_engine.js` (FEV1, FVC, DLCO)

## 3. Architect

### API
- POST `/api/pulmonology/cds/copd_severity`
- POST `/api/pulmonology/cds/asthma_control`
- POST `/api/pulmonology/cds/sleep_interpret`
- GET `/api/pulmonology/cohorts/copd`, `/osa`

## 4. DevOps
- RLS, encrypted PFT/sleep study
- Audit every bronchoscopy

## 5. PM/UX
- Sub-tabs: Asthma, COPD, Sleep, Bronch, ILD, PH
- Layout D (chart) for PFT trend

## 6. Compliance
- CBAHI, JCI, AASM sleep standards

## KPIs
1. Smoking cessation doc ≥80% COPD
2. Annual flu vaccine ≥90%
3. Sleep study adherence ≥85%
4. Home O2 appropriate use ≥95%
5. 30-day COPD readmit ≤15%

## New files (this batch)
- Synthesis
