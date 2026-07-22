# Oncology Therapeutics — Batch 6 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO

### Clinical Scope
- **Mission:** Radiation oncology (IMRT, SRS, Gamma, Cyber, Proton, Brachy) + Clinical pharmacy (chemo, ICU, peds, hem, drug info, TDM)
- **Top 5:** C50.9 (Breast Ca), C34.9 (Lung Ca), C61 (Prostate Ca), C18.9 (Colon Ca), C85.9 (Lymphoma)
- **Care bundles:** Neutropenic fever, tumor lysis, chemo double-check, radiation safety
- **Red flags:** Spinal cord compression, SVC syndrome, hypercalcemia, anaphylaxis to chemo

### Sub-units
- **Radiation:** IMRT, SRS, Gamma Knife, CyberKnife, Proton, Brachytherapy
- **Pharmacy:** Chemo, ICU, Peds, Hem, Drug Information, TDM

## 2. AI Engineer
- RAG: ASTRO, ASCO, NCCN, ISMP
- Engines: `tdm_engine.js` (Trough levels), `radiation_dose_engine.js`, `chemo_dose_engine.js`

## 3. KPIs
1. Chemo double-check compliance 100%
2. Radiation plan peer review 100%
3. 30-day post-rad mortality ≤1%
4. TDM in target range ≥75%
5. Oral chemo adherence ≥90%
