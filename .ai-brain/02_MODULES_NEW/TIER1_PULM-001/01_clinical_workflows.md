# 01 — Clinical Workflows (PULM-001)

> **Owner:** CMO
> **Applies:** Pulmonology (general + all subspecialties)

---

## A. Top 10 conditions

| Rank | Condition | ICD-10 | SNOMED |
|------|-----------|--------|--------|
| 1 | Asthma (moderate-severe) | J45 | 195967001 |
| 2 | COPD acute exacerbation | J44.1 | 233604007 |
| 3 | Pneumonia (CAP/HAP) | J18 / J15 | 233604007 |
| 4 | Lung cancer (NSCLC/SCLC) | C34 | 254637007 |
| 5 | Pulmonary embolism | I26 | 59282003 |
| 6 | Pleural effusion | J90 | 60046008 |
| 7 | Pulmonary fibrosis (IPF) | J84.1 | 700250006 |
| 8 | OSA / sleep apnea | G47.3 | 73430006 |
| 9 | Bronchiectasis | J47 | 12295008 |
| 10 | Sarcoidosis | D86 | 83916000 |

## B. Top 20 procedures

| Rank | Procedure | CPT/SBMI | Notes |
|------|-----------|----------|-------|
| 1 | Bronchoscopy + BAL | 31622 | Diagnostic |
| 2 | EBUS-TBNA | 31652 | Mediastinal staging |
| 3 | Thoracentesis | 32554 | Pleural |
| 4 | Chest tube (tube thoracostomy) | 32551 | Pneumothorax / effusion |
| 5 | Pleurodesis | 32560 | Recurrent effusion / pneumothorax |
| 6 | Polysomnography (sleep study) | 95810 | Sleep medicine |
| 7 | CPAP titration | 94660 | Sleep apnea |
| 8 | Pulmonary function tests (PFTs) | 94010 | Diagnostic |
| 9 | 6-minute walk test | 94618 | Functional capacity |
| 10 | Spirometry pre/post bronchodilator | 94016 | Asthma |
| 11 | DLCO (diffusing capacity) | 94729 | ILD workup |
| 12 | SpO2 + ABG analysis | 82803 | Critical care |
| 13 | Lung biopsy (image-guided) | 32405 | ILD / cancer |
| 14 | Indwelling pleural catheter | 32550 | Malignant effusion |
| 15 | Whole lung lavage | 32997 | Pulmonary alveolar proteinosis |
| 16 | Phototherapy (psoralen + UVA) | 96912 | Skin (rare lung) |
| 17 | Endobronchial valve placement | 31647 | Emphysema |
| 18 | Bronchial thermoplasty | 31660 | Severe asthma |
| 19 | High-flow nasal cannula (HFNC) init | 94660 | Acute hypoxemia |
| 20 | Inhaler technique assessment | - | Patient education |

## C. Top critical alerts

| Alert | Trigger | Action | Latency |
|-------|---------|--------|---------|
| **Massive PE alert** | HR>120, SBP<90, SpO2<88, RV strain on echo | STAT CTA + thrombolysis + page on-call | <5m |
| **Status asthmaticus** | Silent chest, exhausted, rising CO2 | STAT ICU admit, mag sulfate, vent | <5m |
| **Massive hemoptysis** | >100mL/24h | STAT bronchoscopy, embolization | <30m |
| **Tension pneumothorax** | Hypotension + decreased BS | STAT needle decompression | <1m |
| **Severe OSA + driving risk** | AHI>30, daytime sleepiness | Counsel + refer for CPAP | <24h |
| **Inhaler allergy detected** | Cross-reactivity known | Switch to alt class | <1m |
| **Pregnant + ACEi or mycophenolate** | teratogens | BLOCK + OBG consult | <1m |

## D. Care pathway links

- PATH:PE_MASSIVE
- PATH:STATUS_ASTHMATICUS
- PATH:PULM_EMBOLISM_NORMOTENSIVE
- PATH:COPD_EXACERBATION
- PATH:COMMUNITY_ACQUIRED_PNEUMONIA
- PATH:PNEUMOTHORAX_PRIMARY
- PATH:PNEUMOTHORAX_TENSION
- PATH:MASSIVE_HEMOPTYSIS
- PATH:ILD_PROGRESSION
- PATH:LUNG_CANCER_SCREENING
- PATH:LUNG_CANCER_DIAGNOSIS_TO_TREATMENT
- PATH:OSA_DIAGNOSIS_TITRATION
- PATH:COVID_SEVERE
- PATH:BRONCHIECTASIS_EXACERBATION

See `.ai-brain/99-upgrade/16-business/pathways/` for full YAML.

## E. Order set library

- OS:PULM:ASTHMA_ACUTE
- OS:PULM:ASTHMA_DC
- OS:PULM:COPD_EXACERBATION
- OS:PULM:COPD_DC
- OS:PULM:PE_NORMOTENSIVE
- OS:PULM:PE_MASSIVE
- OS:PULM:CAP
- OS:PULM:BRONCHOSCOPY
- OS:PULM:EBUS
- OS:PULM:THORACENTESIS
- OS:PULM:CHEST_TUBE
- OS:PULM:PLEURODESIS
- OS:PULM:PSG
- OS:PULM:CPAP_TITRATION
- OS:PULM:LUNG_CANCER_WORKUP
- OS:PULM:HFNC_INIT

See `.ai-brain/99-upgrade/16-business/order-sets/`.

## F. Severity scores

- CURB-65 (pneumonia)
- PSI / PORT (pneumonia)
- GOLD stage (COPD)
- ACT score (asthma)
- Epworth Sleepiness Scale
- STOP-BANG (sleep apnea)
- Wells PE
- PESI / sPESI
- EmPHasis-10 (PH)
- GAP score (ILD)

## G. SFDA-approved drug classes

- ICS (beclomethasone, budesonide, fluticasone)
- LABA (formoterol, salmeterol)
- LAMA (tiotropium, glycopyrronium)
- LTRA (montelukast)
- Biologics (omalizumab, mepolizumab, benralizumab, dupilumab, tezepelumab)
- PDE4i (roflumilast)
- Mucolytics (erdosteine, N-acetylcysteine)
- Inhaled antibiotics (tobramycin, aztreonam)
- Antifibrotics (nintedanib, pirfenidone)
- Pulmonary vasodilators (sildenafil, bosentan)
- Anticoagulants (LMWH, DOACs)
- Antibiotics per local antibiogram

## H. Workflow: New patient flow

1. Referral received (FHIR ServiceRequest)
2. Triage by clinical urgency (red flag check)
3. PFTs + imaging scheduled (per CT chest if indicated)
4. First visit: history, exam, plan
5. AI-generated differential (PROMPT:PULM-001:initial_assessment with citations)
6. Provider accepts/edits/rejects
7. Orders placed (order sets selected)
8. Care plan emitted (goals + interventions)
9. Follow-up scheduled
10. KPI captured (dx time, dx accuracy)

---

*Owner: CMO — version 1.0 — 2026-08-01*
