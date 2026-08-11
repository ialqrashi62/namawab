# Laboratory (DEP-039) — Brain Summary

## Quick Facts
| Field | Value |
|---|---|
| Code | DEP-039 |
| Arabic | المختبر |
| English | Laboratory |
| Group | diagnostics |
| Facility Types | medical_city, tertiary_hospital, general_hospital, diagnostic_center |

## Subspecialties
- general
- clinical_chemistry
- microbiology
- hematology_lab
- immunology_lab
- molecular_lab
- blood_bank_lab
- toxicology_lab
- histopathology_lab
- genetics_lab


## Top 10 Conditions (ICD-10)
1. anemia_workup
2. diabetes_monitoring
3. lipid_panel
4. thyroid_workup
5. infection_workup
6. coagulation_workup
7. liver_function_workup
8. renal_function_workup
9. cardiac_marker_workup
10. tumor_marker_workup


## Top 20 Procedures (SNOMED-CT)
1. CBC
2. lipid_panel
3. HbA1c
4. liver_function
5. kidney_function
6. thyroid_function
7. coagulation_panel
8. urinalysis
9. blood_culture
10. urine_culture
11. stool_analysis
12. hepatitis_panel
13. HIV_test
14. PSA
15. troponin
16. BNP
17. vitamin_D
18. ferritin
19. Hb_electrophoresis
20. PCR_testing


## Red Flags
- ⚠️ critical_high_potassium
- ⚠️ critical_low_hemoglobin
- ⚠️ positive_blood_culture
- ⚠️ critical_high_troponin
- ⚠️ critical_low_platelets


## Risk Stratification Scores
- critical_values_protocol
- delta_check
- QC_westgard_rules


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