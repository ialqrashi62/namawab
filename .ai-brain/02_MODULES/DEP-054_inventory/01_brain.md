# Inventory_Supply_Chain (DEP-054) — Brain Summary

## Quick Facts
| Field | Value |
|---|---|
| Code | DEP-054 |
| Arabic | المخزون وسلسلة الإمداد |
| English | Inventory_Supply_Chain |
| Group | operational |
| Facility Types | medical_city, tertiary_hospital, general_hospital, polyclinic |

## Subspecialties
- general
- medical_supplies
- surgical_supplies
- pharmaceutical_inventory
- equipment_inventory
- blood_bank_inventory
- sterilization_supply
- sterile_processing


## Top 10 Conditions (ICD-10)
1. stockout_critical
2. expiry_management
3. recall_management
4. par_level_optimization
5. vendor_management
6. consignment_inventory
7. just_in_time_inventory
8. cycle_counting
9. inventory_valuation
10. dead_stock_management


## Top 20 Procedures (SNOMED-CT)
1. purchase_order_creation
2. goods_receipt
3. putaway
4. picking
5. packing
6. shipping
7. cycle_counting
8. physical_inventory
9. stock_adjustment
10. transfer_order
11. return_to_vendor
12. slow_moving_report
13. expiry_report
14. recall_process
15. vendor_evaluation
16. contract_management
17. demand_forecasting
18. par_level_review
19. ABC_analysis
20. FSN_analysis


## Red Flags
- ⚠️ critical_drug_stockout
- ⚠️ expired_drug_in_stock
- ⚠️ recalled_product_in_use
- ⚠️ blood_product_shortage
- ⚠️ surgical_supply_shortage


## Risk Stratification Scores
- stockout_rate
- expiry_rate
- inventory_turnover
- carrying_cost
- dead_stock_percentage


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