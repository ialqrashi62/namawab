# Nuclear_Medicine (DEP-042) — Brain Summary

## Quick Facts
| Field | Value |
|---|---|
| Code | DEP-042 |
| Arabic | الطب النووي |
| English | Nuclear_Medicine |
| Group | diagnostics |
| Facility Types | medical_city, tertiary_hospital |

## Subspecialties
- general
- pet_imaging
- spect_imaging
- therapy_nuclear
- thyroid_nuclear
- bone_scan


## Top 10 Conditions (ICD-10)
1. cancer_staging_nucmed
2. bone_metastases_workup
3. thyroid_cancer_nucmed
4. hyperthyroidism_treatment
5. neuroendocrine_tumor_imaging
6. cardiac_perfusion_imaging
7. renal_function_scan
8. liver_function_scan
9. infection_imaging
10. dementia_imaging


## Top 20 Procedures (SNOMED-CT)
1. pet_ct
2. bone_scan
3. thyroid_scan
4. MIBG_scan
5. octreotide_scan
6. renal_scan
7. hepatobiliary_scan
8. gastric_emptying_scan
9. lung_perfusion_scan
10. cardiac_perfusion_scan
11. parathyroid_scan
12. sentinel_node_mapping
13. radioiodine_therapy
14. lutetium_therapy
15. yttrium_therapy


## Red Flags
- ⚠️ thyroid_storm_post_rai
- ⚠️ radiation_exposure_accident
- ⚠️ severe_allergic_reaction_radiotracer
- ⚠️ bone_marrow_suppression_post_therapy
- ⚠️ radiation_safety_breach


## Risk Stratification Scores
- Deauville_criteria
- Krenning_score
- SUV_max
- ejection_fraction_nucmed
- GFR_nucmed


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