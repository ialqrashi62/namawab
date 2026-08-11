# Radiology (DEP-040) — Brain Summary

## Quick Facts
| Field | Value |
|---|---|
| Code | DEP-040 |
| Arabic | الأشعة |
| English | Radiology |
| Group | diagnostics |
| Facility Types | medical_city, tertiary_hospital, general_hospital, diagnostic_center |

## Subspecialties
- general
- ct
- mri
- ultrasound
- mammography
- neuroradiology
- msk_radiology
- body_radiology
- pediatric_radiology
- emergency_radiology


## Top 10 Conditions (ICD-10)
1. stroke_imaging
2. trauma_imaging
3. cancer_staging
4. cardiac_imaging
5. abdominal_imaging
6. msk_imaging
7. neuro_imaging
8. breast_imaging
9. vascular_imaging
10. pediatric_imaging


## Top 20 Procedures (SNOMED-CT)
1. chest_xray
2. abdominal_xray
3. ct_head
4. ct_chest
5. ct_abdomen
6. mri_brain
7. mri_spine
8. ultrasound_abdomen
9. ultrasound_pelvic
10. mammography
11. doppler_study
12. ct_angiography
13. mr_angiography
14. fluoroscopy
15. barium_study
16. ivp
17. ct_guidance_biopsy
18. US_guidance_biopsy
19. DEXA_scan
20. pet_ct


## Red Flags
- ⚠️ aortic_dissection
- ⚠️ pulmonary_embolism
- ⚠️ ruptured_aneurysm
- ⚠️ tension_pneumothorax
- ⚠️ intracranial_hemorrhage


## Risk Stratification Scores
- BI_RADS
- PI_RADS
- LI_RADS
- TI_RADS
- lung_RADS


## File Manifest (35 files)
1. **01_brain.md** — this file
2. **02_clinical_spec.md** — clinical specifications (CMO)
3. **03_ai_orchestration.md** — RAG/LangGraph (AIE)
4. **04_technical_architecture.md** — APIs/ERD (Architect)
5. **05_ux_ui_stitch.md** — Stitch UI (UX)
6. **06_compliance_security.md** — JCI/CBAHI/NPHIES (Compliance)
7. **07_implementation_plan.md** — DevOps deploy plan
8. **08_prompt_engineering.md** — System prompts
9. **09_workflow_orchestration.md** — BPMN state machine
10. **10_langchain_chains.md** — Chains + Agents
11. **11_vector_mine.md** — Vector collections
12. **12_api_openapi.yaml** — OpenAPI 3.0.3
13. **13_data_erd.sql** — ERD DDL
14. **14_data_migrations_up.sql** — forward
15. **15_data_migrations_down.sql** — reverse
16. **16_data_seed.sql** — ICD/SNOMED/drugs
17. **17_rag_pipeline.py** — Python RAG pipeline
18. **18_backend_models.py** — SQLAlchemy models
19. **19_backend_schemas.py** — Pydantic schemas
20. **20_backend_service.py** — Business logic
21. **21_backend_router.py** — FastAPI router
22. **22_frontend_page.tsx** — Main page (Stitch)
23. **23_frontend_components.tsx** — Components
24. **24_frontend_api_client.ts** — API client
25. **25_style_guide_tokens.json** — Design tokens
26. **26_i18n_ar.json** — Arabic strings
27. **27_i18n_en.json** — English strings
28. **28_test_unit.py** — Unit tests
29. **29_test_integration.py** — Integration tests
30. **30_test_bdd.feature** — BDD scenarios
31. **31_user_manual_ar.md** — User manual AR
32. **32_user_manual_en.md** — User manual EN
33. **33_training_video_script.md** — Training video
34. **34_legal_compliance.md** — Legal docs
35. **35_pmo_budget.md** — Agile + Budget

## Dependencies
- Parent: diagnostics
- Related: 

---
Generated: 2026-08-08