# Insurance_Claims_NPHIES (DEP-058) — Brain Summary

## Quick Facts
| Field | Value |
|---|---|
| Code | DEP-058 |
| Arabic | التأمين والمطالبات |
| English | Insurance_Claims_NPHIES |
| Group | operational |
| Facility Types | medical_city, tertiary_hospital, general_hospital, all_facilities |

## Subspecialties
- general
- pre_authorization
- claims_management
- denial_management
- payer_relations
- network_management
- eligibility_verification
- coordination_of_benefits
- fraud_detection
- subrogation


## Top 10 Conditions (ICD-10)
1. claim_denial_insurance
2. prior_auth_denial
3. eligibility_issue
4. network_out
5. coordination_of_benefits
6. fraud_detection_case
7. subrogation_case
8. payer_contract_dispute
9. claim_appeal_required
10. chronic_condition_management_insurance


## Top 20 Procedures (SNOMED-CT)
1. eligibility_verification
2. prior_authorization_request
3. prior_authorization_followup
4. claim_submission_nphies
5. claim_status_inquiry
6. claim_resubmission
7. denial_appeal_nphies
8. payment_reconciliation
9. contract_management_insurance
10. network_management
11. payer_meeting
12. fraud_investigation
13. coordination_of_benefits_calc
14. subrogation_recovery
15. member_services_call
16. grievance_handling
17. premium_reconciliation
18. capitation_reconciliation
19. fee_schedule_management
20. payer_reporting


## Red Flags
- ⚠️ claim_denial_high_value_nphies
- ⚠️ prior_authorization_emergency_denial
- ⚠️ network_out_emergency
- ⚠️ fraud_allegation_severe
- ⚠️ payer_termination_threat


## Risk Stratification Scores
- denial_rate_nphies
- days_in_AR_nphies
- prior_auth_approval_rate
- network_adequacy
- member_satisfaction
- claim_accuracy_nphies
- payment_cycle_time
- cost_per_claim
- revenue_per_member
- loss_ratio


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