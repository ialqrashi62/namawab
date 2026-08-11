# NICU (DEP-023) — Brain Summary

## Quick Facts
| Field | Value |
|---|---|
| Code | DEP-023 |
| Arabic | العناية المركزة لحديثي الولادة |
| English | NICU |
| Group | critical_care |
| Facility Types | medical_city, tertiary_hospital |

## Subspecialties
- general
- premature
- surgical_neonate
- cardiac_neonate
- neuro_neonate


## Top 10 Conditions (ICD-10)
1. prematurity
2. RDS
3. neonatal_sepsis
4. neonatal_jaundice
5. congenital_heart_disease
6. NEC
7. IVH
8. birth_asphyxia
9. meconium_aspiration
10. diaphragmatic_hernia


## Top 20 Procedures (SNOMED-CT)
1. intubation_premature
2. surfactant_administration
3. central_line_umbilical
4. exchange_transfusion
5. phototherapy
6. therapeutic_hypothermia
7. ECMO_neonatal
8. ROP_screening
9. circumcision
10. lumbar_puncture_neonatal


## Red Flags
- ⚠️ severe_IVH
- ⚠️ NEC_perforation
- ⚠️ pneumothorax_neonate
- ⚠️ NEC_sepsis
- ⚠️ PDA_significant


## Risk Stratification Scores
- CRIB
- SNAP
- SNAPPE
- Apgar
- Silverman_Anderson


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