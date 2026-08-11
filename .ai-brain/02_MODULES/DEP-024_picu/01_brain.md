# PICU (DEP-024) — Brain Summary

## Quick Facts
| Field | Value |
|---|---|
| Code | DEP-024 |
| Arabic | العناية المركزة للأطفال |
| English | PICU |
| Group | critical_care |
| Facility Types | medical_city, tertiary_hospital |

## Subspecialties
- general
- pediatric_trauma
- post_cardiac_pediatric
- post_neuro_pediatric
- neonatal_pediatric


## Top 10 Conditions (ICD-10)
1. pediatric_sepsis
2. severe_asthma
3. status_epilepticus
4. diabetic_ketoacidosis
5. post_cardiac_surgery
6. severe_pneumonia
7. traumatic_brain_injury
8. anaphylaxis
9. ingestions
10. burns_pediatric


## Top 20 Procedures (SNOMED-CT)
1. pediatric_intubation
2. mechanical_ventilation_pediatric
3. central_line_pediatric
4. arterial_line_pediatric
5. bronchoscopy_pediatric
6. CRRT_pediatric
7. tracheostomy_pediatric
8. sedation_pediatric
9. pediatric_resuscitation
10. ECMO_pediatric


## Red Flags
- ⚠️ cardiac_arrest_pediatric
- ⚠️ severe_hypoxia_pediatric
- ⚠️ refractory_shock_pediatric
- ⚠️ status_epilepticus_pediatric
- ⚠️ brain_herniation_pediatric


## Risk Stratification Scores
- PELOD
- PRISM_III
- PIM2
- PEWS
- GCS_pediatric


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
- Parent: critical_care
- Related: 

---
Generated: 2026-08-08