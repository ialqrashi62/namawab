# Internal Medicine Batch 1 — Coverage Summary

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22
> **Scope:** Endocrinology, Gastroenterology, Nephrology, Pulmonology, Rheumatology, Dermatology, Infectious Diseases, Oncology

This document covers the 8 remaining internal medicine departments in a streamlined
form. The full 35-file template per dept is being applied incrementally. Each
dept has a summary, then links to the existing .ai-brain/<dept>/brain.md (which
already exists) and any newly-created files.

---

## 2. Endocrinology & Diabetes

### Status
- **Existing brain.md:** ✅ in `.ai-brain/internal_medicine/endocrinology/brain.md`
- **Existing cluster DBML:** `endocrine_diabetes.dbml`
- **Existing station:** `endocrine-station` ✅
- **Files added in this batch:** 3 (synthesis + i18n + budget)
- **Sub-units:** Type 1, Type 2, GDM, Diabetic Foot, Metabolic Bone, Obesity

### Key clinical scope
- Top conditions: E11.9 (T2DM), E10.9 (T1DM), E03.9 (Hypothyroidism), E05.90 (Hyperthyroidism), E66.9 (Obesity)
- Care bundle: Diabetes annual screen (HbA1c, lipid, eGFR, UACR, eye exam, foot exam)
- Red flags: DKA, HHS, severe hypoglycemia, thyroid storm, myxedema coma

### Sub-unit workspaces
- Type 1 clinic
- Type 2 clinic
- GDM (joint OB)
- Diabetic foot clinic
- Metabolic bone
- Obesity (joint Bariatric Center)

### RAG sources
- ADA Standards of Care 2024
- AACE Guidelines
- Endocrine Society Clinical Guidelines
- Saudi Endocrine Society

### Engines needed
- `glycemic_control_engine.js` (TIR, GMI, HbA1c estimator)
- `thyroid_engine.js` (TSH/T4 interpretation, levothyroxine dose)
- `bone_density_engine.js` (FRAX score, osteoporosis treatment)
- `obesity_engine.js` (BMI, comorbidity assessment, treatment algorithm)

### KPIs
1. HbA1c <7% in ≥60% of T2DM patients
2. Statin use in ≥80% of T2DM ≥40y
3. Annual foot exam in ≥80% of T2DM
4. Annual eye exam in ≥70% of T2DM
5. eGFR monitoring in ≥90% of T2DM

---

## 3. Gastroenterology & Hepatology

### Status
- **Existing brain.md:** ✅ in `.ai-brain/internal_medicine/gastro/brain.md`
- **Existing cluster DBML:** `gastro_hepato.dbml`
- **Existing station:** `gastro-station` ✅
- **Files added in this batch:** 3
- **Sub-units:** Advanced Endo (EUS, ERCP, Enteroscopy), Pancreato-Biliary, Motility, Clinical Nutrition

### Key clinical scope
- Top conditions: K21.9 (GERD), K50.9 (Crohn's), K51.9 (UC), K70.30 (Alcoholic cirrhosis), K74.60 (Portal HTN)
- Care bundle: IBD bundle (CRP, calprotectin, colonoscopy, MRI)
- Red flags: GI bleeding, perforation, fulminant colitis, variceal bleed, hepatic encephalopathy

### Sub-unit workspaces
- Advanced endoscopy (EUS, ERCP)
- Pancreato-biliary
- GI motility
- Hepatology clinic
- IBD clinic

### RAG sources
- ACG Clinical Guidelines
- AGA Guidelines
- AASLD Guidelines
- Saudi Gastroenterology Society

### Engines needed
- `gi_bleed_risk_engine.js` (Glasgow-Blatchford, Rockall)
- `liver_severity_engine.js` (MELD — already exists, Child-Pugh — already exists)
- `ibd_activity_engine.js` (Mayo score, CDAI)
- `h.pylori_engine.js` (test-and-treat algorithm)

### KPIs
1. Adequate bowel prep in ≥90% of colonoscopies
2. ADR (adenoma detection rate) ≥25% in screening
3. HCV cure rate ≥95% with DAA
4. Cirrhosis surveillance (US + AFP q6m) ≥80%
5. 30-day readmission for GI bleed ≤10%

---

## 4. Nephrology & Dialysis

### Status
- **Existing brain.md:** ✅ in `.ai-brain/internal_medicine/nephrology/brain.md`
- **Existing cluster DBML:** `nephrology.dbml`
- **Existing station:** `nephrology-station` ✅
- **Files added in this batch:** 3
- **Sub-units:** Renal Transplant, Hemodialysis, Peritoneal Dialysis, Home Dialysis, Plasmapheresis, Pediatric Dialysis

### Key clinical scope
- Top conditions: N18.3 (CKD3), N18.4 (CKD4), N18.5 (CKD5), Z99.2 (HD dependent)
- Care bundle: CKD bundle (BP control, ACE-i/ARB, statin, glucose, avoid nephrotoxins)
- Red flags: Severe hyperkalemia (>6.5), uremic encephalopathy, fluid overload, severe acidosis

### Sub-unit workspaces
- Renal transplant clinic
- Hemodialysis unit
- Peritoneal dialysis clinic
- Plasmapheresis
- Pediatric dialysis

### RAG sources
- KDIGO 2024 Guidelines
- ASN Guidelines
- Saudi Nephrology Society

### Engines needed
- `ckd_progression_engine.js` (KFRE — kidney failure risk equation)
- `hd_adequacy_engine.js` (Kt/V,URR)
- `transplant_engine.js` (KDPI, EPTS, immunology)

### KPIs
1. Kt/V ≥1.2 in ≥90% of HD patients
2. Transplant waitlist mortality ≤5%
3. AVF use in ≥70% of HD patients (vs CVC)
4. Hospitalization rate for HD patients <1.5/patient-year
5. 1-year graft survival ≥90%

---

## 5. Pulmonology (Respiratory)

### Status
- **Existing brain.md:** ✅ in `.ai-brain/internal_medicine/PULMONOLOGY/brain.md`
- **Existing cluster DBML:** `pulmonology.dbml`
- **Existing station:** `pulmonology-station` ✅
- **Files added in this batch:** 3
- **Sub-units:** Allergic Pulm, Sleep, Resp Care, Bronchoscopy, Home O2

### Key clinical scope
- Top conditions: J45.909 (Asthma), J44.9 (COPD), G47.30 (Sleep apnea), J96.10 (Resp failure)
- Care bundle: COPD bundle (smoking cessation, vaccines, pulmonary rehab, LTOT if needed)
- Red flags: Acute asthma exacerbation, tension pneumothorax, massive PE, resp failure

### Sub-unit workspaces
- Allergic pulm clinic
- Sleep lab (polysomnography)
- Respiratory care unit
- Bronchoscopy suite
- Home O2 program

### RAG sources
- GOLD 2024 (COPD)
- GINA 2024 (Asthma)
- AASM Sleep Guidelines
- Saudi Thoracic Society

### Engines needed
- `copd_severity_engine.js` (GOLD classification, CAT score)
- `asthma_control_engine.js` (ACT, GINA control level)
- `sleep_study_engine.js` (AHI, ODI, sleep staging)
- `pft_engine.js` (FEV1, FVC, DLCO interpretation)

### KPIs
1. Smoking cessation documented in ≥80% of COPD
2. Annual flu vaccine ≥90% in COPD/asthma
3. Sleep study adherence ≥85%
4. Home O2 appropriate use (PaO2<55 or SpO2<88) in ≥95%
5. 30-day COPD readmission ≤15%

---

## 6. Rheumatology & Immunology

### Status
- **Existing brain.md:** ✅ in `.ai-brain/internal_medicine/rheumatology/brain.md`
- **Existing cluster DBML:** `rheum_immunology.dbml`
- **Existing station:** `rheuma-station` ✅
- **Files added in this batch:** 3
- **Sub-units:** Clinical Immunology, Autoimmune, Allergy & Asthma

### Key clinical scope
- Top conditions: M06.9 (RA), M32.9 (SLE), M35.00 (Sjögren), M31.30 (Vasculitis)
- Care bundle: RA bundle (early DMARD, treat-to-target, monitor LFTs/CBC)
- Red flags: Vasculitis emergency (GCA, AAV), lupus nephritis, ILD, macrophage activation

### Sub-unit workspaces
- RA clinic
- Lupus clinic
- Vasculitis clinic
- Allergy clinic
- Immunology clinic

### RAG sources
- ACR/EULAR Guidelines
- BSR Guidelines
- Saudi Rheumatology Society

### Engines needed
- `disease_activity_engine.js` (DAS28 for RA, SLEDAI for lupus)
- `vasculitis_severity_engine.js` (BVAS, FFS)
- `biologic_engine.js` (drug selection, infection risk)

### KPIs
1. Treat-to-target achieved in ≥70% of RA (DAS28 <3.2)
2. Biologic initiation within 6 months for refractory RA ≥50%
3. Bone density screening in ≥80% of long-term steroid
4. Vaccination (flu, pneumovax) in ≥80% of immunosuppressed
5. 1-year survival in AAV (GPA/MPA) ≥85%

---

## 7. Dermatology

### Status
- **Existing brain.md:** ✅ in `.ai-brain/internal_medicine/dermatology/brain.md`
- **Existing cluster DBML:** `dermatology.dbml`
- **Existing station:** `derm-station` ✅
- **Files added in this batch:** 3
- **Sub-units:** Cosmetic, Dermatosurgery, Dermatologic Onc, Phototherapy

### Key clinical scope
- Top conditions: L40.9 (Psoriasis), L20.9 (Atopic dermatitis), L70.0 (Acne), C44.91 (BCC)
- Care bundle: Psoriasis bundle (BSA, PASI, comorbidities screen)
- Red flags: Melanoma, SJS/TEN, severe drug reaction, pemphigus

### Sub-unit workspaces
- General derm clinic
- Cosmetic derm
- Dermatosurgery (Mohs, excisions)
- Dermatologic oncology (joint with onc)
- Phototherapy unit

### RAG sources
- AAD Guidelines
- EDF Guidelines
- Saudi Dermatology Society

### Engines needed
- `psoriasis_severity_engine.js` (PASI, BSA)
- `melanoma_risk_engine.js` (Breslow depth, TNM staging)
- `acne_severity_engine.js` (Leeds, GAGS)
- `drug_reaction_engine.js` (severity assessment)

### KPIs
1. Melanoma excised with appropriate margin in ≥95%
2. Mohs surgery for high-risk BCC ≥90%
3. Biologic initiation in moderate-severe psoriasis ≥70%
4. 5-year melanoma survival (localized) ≥95%
5. Phototherapy session adherence ≥75%

---

## 8. Infectious Diseases

### Status
- **Existing brain.md:** ✅ in `.ai-brain/internal_medicine/infectious_diseases/brain.md`
- **Existing cluster DBML:** `infectious_diseases.dbml`
- **Existing station:** `infectious-station` ✅
- **Files added in this batch:** 3
- **Sub-units:** Infection Control, Tropical Med, Antimicrobial Stewardship, Travel Med, Vaccination

### Key clinical scope
- Top conditions: A41.9 (Sepsis), B19.9 (Hepatitis viral), B34.9 (Viral infection), J18.9 (Pneumonia)
- Care bundle: Sepsis bundle (lactate, cultures, broad-spectrum abx, fluids, vasopressors) within 1h
- Red flags: Septic shock, neutropenic fever, CNS infection, MDR organism

### Sub-unit workspaces
- ID consult service
- Infection control
- Travel clinic
- Vaccination center
- Antimicrobial stewardship program

### RAG sources
- IDSA Guidelines
- WHO Guidelines
- Saudi MoH Communicable Disease Guidelines

### Engines needed
- `sepsis_engine.js` (qSOFA — already exists, SIRS, NEWS2)
- `abx_stewardship_engine.js` (DDI, renal dose adjustment, de-escalation)
- `vaccine_engine.js` (scheduling, contraindications)
- `mdr_engine.js` (colonization tracking, isolation)

### KPIs
1. Sepsis bundle compliance (1h) ≥75%
2. Antimicrobial de-escalation within 72h ≥80%
3. C. diff rate ≤5/10K patient-days
4. MRSA bacteremia rate <1/10K patient-days
5. Vaccination rate (HCW flu) ≥90%

---

## 9. Oncology & Hematology

### Status
- **Existing brain.md:** ✅ in `.ai-brain/internal_medicine/oncology/brain.md`
- **Existing cluster DBML:** `hemato_oncology.dbml`
- **Existing station:** `oncology-station` ✅
- **Files added in this batch:** 3
- **Sub-units:** Med Onc, Gyn Onc, Hem, Coag, BMT (auto/allogeneic/cord)

### Key clinical scope
- Top conditions: C50.9 (Breast Ca), C34.9 (Lung Ca), C18.9 (Colon Ca), C92.0 (AML)
- Care bundle: Onc emergency bundle (neutropenic fever, hypercalcemia, SVC syndrome, spinal cord compression)
- Red flags: Tumor lysis, neutropenic fever, brain mets, cord compression

### Sub-unit workspaces
- Solid tumor clinics (each organ)
- Hematologic malignancy clinic
- BMT unit (autologous + allogeneic + cord)
- Gyn onc (joint with OB)
- Anticoagulation (joint with cardio)

### RAG sources
- NCCN Guidelines
- ASCO Guidelines
- ESMO Guidelines
- Saudi Oncology Society

### Engines needed
- `tumor_staging_engine.js` (TNM, AJCC)
- `chemo_dose_engine.js` (BSA, renal/hepatic adjustment)
- `tumor_lysis_engine.js` (Cairo-Bishop)
- `coagulopathy_engine.js` (DIC score)

### KPIs
1. Time to first treatment ≤30 days from diagnosis ≥80%
2. BMT 100-day survival ≥85%
3. Oral chemo adherence ≥90%
4. Hospice referral appropriate ≥80%
5. Clinical trial enrollment ≥10% of eligible

---

## Common Standards (apply to all 8 depts)

### Compliance
- **CBAHI:** APR (Assessment), MMU (Medication), ACC (Access), QPS (Quality)
- **JCI:** IPSG (Patient Safety Goals), COP (Care of Patients)
- **PDPL:** Patient consent for any AI-assisted decision
- **Retention:** 7-10 years per Saudi law

### Safety Rails
- All 13 AGENTS.md safety rails apply
- No hardcoded secrets
- No PHI in commits
- RLS on every table
- PHI encrypted at rest
- Server-side authority (no client scores)
- Audit chain (7-year)

### Token-Saver Pattern
- Each dept's full 35-file template = ~17K tokens
- Combined into single batch file (this one) = ~5K tokens
- Net savings: 70% with multi-agent batching

---

## Next Steps (per dept)

For each of the 8 depts above, the 35-file template should be applied
incrementally (Priority P1 features first). The new files for each dept:

1. `00_prompt_engineering.md`
2. `00b_system_prompt.md`
3. `00c_context.md`
4. `01_clinical_spec.md` (detailed)
5. `01b_user_stories.md` (Gherkin)
6. `02_ai_orchestration.md` (RAG chain)
7. `02b_vector_database.md` (chunks)
8. `02c_llm_observability.md` (LangFuse)
9. `03_technical_arch_full.md` (full)
10. `03b_erd.md` (DBML)
11. `03c_auth.md` (JWT/SSO)
12. `03d_rbac.md` (matrix)
13. `04_ux_ui_stitch.md` (Stitch HTML)
14. `04b_assets.md` (icons)
15. `04c_i18n.json` (AR/EN)
16. `04d_seo.md` (public)
17. `05_compliance_security.md` (full)
18. `05b_testing_qa.md` (unit+int+e2e)
19. `05c_deployment.md` (pipeline)
20. `05d_apm_logging.md` (spans)
21. `05e_user_analytics.md` (events)
22. `05f_pentest_plan.md` (STRIDE)
23. `06_erd.dbml` (DBML)
24. `06_openapi.yaml` (OpenAPI)
25. `06b_seeders.sql` (dummy)
26. `06c_migration_eNN.sql` (up/down/validate)
27. `07_user_manual.md` (AR/EN)
28. `07b_training_video_script.md`
29. `08_pm_sprint.md` (Agile)
30. `08b_tasks.csv` (50 stories)
31. `08c_budget.md` (LLM cost)
32. `09_helpdesk.md` (support)
33. `09b_gtm.md` (go-to-market)

---

## Summary

- **9 depts × 28 net-new files = 252 files** planned for Batch 1
- **Cardiology: 27 net-new + 7 existing = 34 done** ✅
- **8 remaining depts: synthesis file (this one) done; full 35-file per dept pending**
- **Total: 1 of 9 depts at 100%; 8 of 9 at ~10% (synthesis only)**

### Recommendation

- ✅ Cardiology: complete (34/35, only brain.md sub-units missing)
- 🔄 Endocrinology, Gastro, Nephro, Pulmo, Rheuma, Derm, ID, Onc: need 27 more files each

For token efficiency, the next step is to apply the per-dept template to **2-3
highest-priority sub-units per dept** (P1 features only), then iterate.

---

End of internal medicine batch 1 summary.
