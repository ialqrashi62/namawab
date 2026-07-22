# Endocrinology — Batch 1 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22
> **Status:** A (existing brain) + new synthesis + 2 new files

## 1. CMO Input

### Clinical Scope
- **Mission:** Endocrine + diabetes care (T1DM, T2DM, thyroid, bone, obesity)
- **Top 5 conditions:** E11.9 (T2DM), E10.9 (T1DM), E03.9 (Hypothyroidism), E05.90 (Hyperthyroidism), E66.9 (Obesity)
- **Care bundles:** Diabetes annual screen, thyroid workup, osteoporosis screen
- **Red flags:** DKA, HHS, thyroid storm, myxedema coma, adrenal crisis

### Sub-units
1. Type 1 Diabetes Clinic
2. Type 2 Diabetes Clinic
3. GDM (joint with OB)
4. Diabetic Foot & Neuropathy
5. Metabolic Bone Disease
6. Obesity Medicine

## 2. AI Engineer Input

### RAG Sources
- ADA Standards of Care 2024
- AACE Algorithms
- Endocrine Society Clinical Guidelines
- Saudi Endocrine Society

### Engines needed (NEW)
- `glycemic_control_engine.js` (TIR, GMI, HbA1c estimator)
- `thyroid_engine.js` (TSH/T4 interpretation, levothyroxine dose)
- `bone_density_engine.js` (FRAX score, treatment threshold)

## 3. Architect Input

### API Surface
- POST `/api/endocrinology/cds/glycemic_target` (HbA1c target, individualizes)
- POST `/api/endocrinology/cds/thyroid_interpret` (TSH/T4)
- POST `/api/endocrinology/cds/frax` (10-year fracture risk)
- GET `/api/endocrinology/cohorts/t1dm`, `/t2dm`

## 4. DevOps

- RLS on all new tables
- PHI encrypted (HbA1c, lipid, weight)
- Audit every insulin dose change

## 5. PM/UX

- Sub-tabs: T1DM, T2DM, GDM, Foot, Bone, Obesity
- 3-col layout (Layout D — chart-heavy for HbA1c trend)
- i18n keys (see 04c_i18n.json)

## 6. Compliance

- CBAHI: APR, MMU (insulin safety)
- JCI: IPSG.3 (high-alert medication)
- PDPL: consent for AI insulin recommendations

## KPIs
1. HbA1c <7% in ≥60% of T2DM
2. Annual foot exam ≥80%
3. Annual eye exam ≥70%
4. Statin in T2DM ≥40y ≥80%
5. eGFR monitoring ≥90%

## New files (this batch)
- `00_prompt_engineering.md` (skeleton)
- `03_technical_arch_full.md` (skeleton)

(Other 26 files: deferred to next iteration)
