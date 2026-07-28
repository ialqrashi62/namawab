# CARD-001 — Cardiology (قسم طب القلب العام)

> **One-liner:** تشخيص وعلاج أمراض القلب والأوعية الدموية للبالغين، مع 8 sub-units تخصصية.
> **Tier:** 1 · **Group:** internal_medicine · **Owner:** CMO + AIE + SA
> **Generated:** 2026-07-27 · **Catalog:** MASTER_CATALOG_v3.yaml#cardiology
> **Token used:** ~8,200 (Tier-1, S1-S8 applied)

## Quick links

- Catalog: `MASTER_CATALOG_v3.yaml#cardiology`
- Stitch: https://stitch.withgoogle.com/projects/17612445146025313712 (search "cardiology station")
- Live: `namaweb/public/js/doctor-station.js` (existing) + `namaweb/server.js` (routes)
- Engine: `namaweb/specialty_scores.js`, `namaweb/cds.js`, `namaweb/ews_engine.js`
- Compliance: JCI 7th, ACC/AHA, ESC, NPHIES-Cardiology-Bundle, SFDA

## 60-File index

| # | File | Owner |
|---|------|-------|
| 00 | `00_README.md` | ORC |
| 01 | `01_clinical_workflows.md` | CMO |
| 02 | `02_sub_dept_catalog.md` | CMO |
| 03 | `03_icd10_snomed_map.md` | CMO+CQO |
| 04 | `04_clinical_red_flags.md` | CMO |
| 05 | `05_prompt_engineering.md` | AIE |
| 06 | `06_system_prompt.md` | AIE |
| 07 | `07_context_window.md` | AIE |
| 08 | `08_workflow_orchestration.md` | AIE |
| 09 | `09_langchain_chains.md` | AIE |
| 10 | `10_rag_chains.md` | AIE |
| 11 | `11_vector_store_schema.md` | AIE |
| 12 | `12_llm_prompts.md` | AIE |
| 13 | `13_llm_observability.md` | AIE |
| 14 | `14_engine_module.md` | SA |
| 15 | `15_routes_api.md` | SA |
| 16 | `16_middleware_chain.md` | SA |
| 17 | `17_data_flow.md` | SA |
| 18 | `18_erd_diagram.md` | SA |
| 19 | `19_openapi_spec.md` | SA |
| 20 | `20_architecture_decision_record.md` | SA |
| 21 | `21_dbml_schema.md` | SA |
| 22 | `22_migration_up.sql` | SA |
| 23 | `23_migration_down.sql` | SA |
| 24 | `24_migration_validate.sql` | SA |
| 25 | `25_seed_data.sql` | SA+CQO |
| 26 | `26_stitch_layout.md` | PM/UX |
| 27 | `27_wireframes.md` | PM/UX |
| 28 | `28_i18n_keys.md` | PM/UX |
| 29 | `29_design_tokens.md` | PM/UX |
| 30 | `30_user_stories.md` | PM/UX |
| 31 | `31_acceptance_criteria.md` | PM/UX |
| 32 | `32_business_flow.md` | PM/UX |
| 33 | `33_api_rbac_defense_in_depth.md` | DSL |
| 34 | `34_penetration_test_plan.md` | DSL |
| 35 | `35_security_plan.md` | DSL |
| 36 | `36_secrets_management.md` | DSL |
| 37 | `37_deployment_runbook.md` | DSL |
| 38 | `38_ci_cd_pipeline.md` | DSL |
| 39 | `39_monitoring_alerting.md` | DSL |
| 40 | `40_backup_restore_dr.md` | DSL |
| 41 | `41_incident_response.md` | DSL |
| 42 | `42_jci_checklist.md` | CQO |
| 43 | `43_iso_9001_checklist.md` | CQO |
| 44 | `44_pdpl_dpia.md` | CQO |
| 45 | `45_nphies_zatca_map.md` | CQO |
| 46 | `46_consent_forms.md` | CQO |
| 47 | `47_legal_contracts.md` | CQO |
| 48 | `48_audit_trail_design.md` | CQO+DSL |
| 49 | `49_unit_tests.md` | ORC+SA |
| 50 | `50_integration_tests.md` | ORC+SA |
| 51 | `51_e2e_tests.md` | ORC+SA |
| 52 | `52_test_plan.md` | ORC |
| 53 | `53_user_manual.md` | PM/UX |
| 54 | `54_training_video_script.md` | PM/UX |
| 55 | `55_helpdesk_runbook.md` | DSL+PM |
| 56 | `56_budget_token_cost.md` | ORC |
| 57 | `57_task_tracking.md` | ORC |
| 58 | `58_seo_optimization.md` | PM/UX |
| 59 | `59_go_to_market.md` | PM/UX+CQO |
| 60 | `60_closeout.md` | ORC |

## Red flags (top 5)

1. **STEMI** (ST-Elevation MI) — activate CODE STEMI pathway. Door-to-balloon < 90 min.
2. **Aortic Dissection** — tearing chest/back pain, BP differential. CTA angio.
3. **Cardiac Tamponade** — Beck's triad. Pericardiocentesis.
4. **Pulmonary Embolism (massive)** — shock + RV failure. Thrombolysis.
5. **Sudden Cardiac Death risk** — VT/VF, syncope, LVEF < 35%. ICD evaluation.

## Safety rails applied

- `snippet:golden-access` — Cardiologist full access; others need `cross_specialty_grant`
- `snippet:rls-default` — every cardiology table FORCE RLS
- `snippet:phi-vault` — ECG, Echo, Cath images in phi_vault
- `snippet:money-vat` — Cath lab packages server-side only
- `snippet:audit-hash` — every procedure write is hash-chained

## Personas (Stitch)

- **Doctor (Cardiologist)** — main user, full access
- **Nurse (Cath Lab / CCU)** — restricted to assigned cases
- **Technician (Echo / Stress / Holter)** — read + create draft, doctor signs
- **Patient (Portal)** — read-only on own data

## Next phase (after CARD-001)

CARD-002 (Interventional), CARD-003 (EP), CARD-004 (Preventive) — Tier-1 sub-units.
