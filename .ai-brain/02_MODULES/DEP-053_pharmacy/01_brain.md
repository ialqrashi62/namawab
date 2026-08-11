# Pharmacy (DEP-053) — Brain Summary

## Quick Facts
| Field | Value |
|---|---|
| Code | DEP-053 |
| Arabic | الصيدلية |
| English | Pharmacy |
| Group | operational |
| Facility Types | medical_city, tertiary_hospital, general_hospital, polyclinic |

## Subspecialties
- general
- inpatient_pharmacy
- retail_pharmacy
- clinical_pharmacy
- oncology_pharmacy
- nuclear_pharmacy
- compounding_pharmacy
- iv_admixture


## Top 10 Conditions (ICD-10)
1. medication_safety
2. drug_interaction
3. allergy_check
4. renal_dose_adjustment
5. hepatic_dose_adjustment
6. antimicrobial_stewardship
7. formulary_management
8. controlled_substance_management
9. pharmacovigilance
10. medication_reconciliation


## Top 20 Procedures (SNOMED-CT)
1. prescription_verification
2. dispensing
3. iv_admixture
4. chemotherapy_admixing
5. total_parenteral_nutrition
6. unit_dose_distribution
7. controlled_substance_distribution
8. barcode_medication_administration
9. drug_information_query
10. pharmacokinetic_dosing
11. warfarin_dosing
12. vancomycin_dosing
13. aminoglycoside_dosing
14. renal_dose_adjustment
15. hepatic_dose_adjustment
16. medication_reconciliation
17. adverse_drug_reaction_reporting
18. medication_error_reporting
19. drug_use_evaluation
20. formulary_review


## Red Flags
- ⚠️ medication_error_severe
- ⚠️ anaphylactic_drug_reaction
- ⚠️ narrow_therapeutic_index_toxicity
- ⚠️ controlled_substance_diversion
- ⚠️ look_alike_sound_alike_error


## Risk Stratification Scores
- medication_adherence_rate
- medication_error_rate
- BCMA_compliance
- ADR_rate
- antimicrobial_stewardship_metrics


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
- Parent: operational
- Related: 

---
Generated: 2026-08-08