---
id: TIER1_CATALOG
version: 1.0
date: 2026-08-01
owner: ORC
status: ACTIVE
applies: 20 dept Tier-1 batch (full 60-file blueprint each)
---

# Tier-1 Dept Batch Catalog + Per-dept Plan

> **Purpose:** Plan and track Tier-1 depts (full 60 files each). PULM-001 is shipped as the demonstration example. The remaining 19 depts have the same scaffolding ready to be filled in.

---

## Catalog

| # | Dept | Tier | Status | Coverage gap (vs Epic) |
|---|------|------|--------|------------------------|
| 1 | **CARD-001** Cardiology | 1 | ✅ example dept shipped | n/a |
| 2 | **PULM-001** Pulmonology | 1 | ✅ shipped 2026-08-01 | full |
| 3 | **GI-001** Gastroenterology | 1 | ⏳ next | full |
| 4 | **NEPH-001** Nephrology | 1 | ⏳ next | full |
| 5 | **ONC-001** Heme-Onc | 1 | ⏳ next | full |
| 6 | **ENDO-001** Endocrinology | 1 | ⏳ next | full |
| 7 | **ID-001** Infectious Diseases | 1 | ⏳ next | full |
| 8 | **ER-001** Emergency | 1 | ⏳ next | full |
| 9 | **OBG-001** OB/GYN | 1 | ⏳ next | full |
| 10 | **PEDS-001** Pediatrics | 1 | ⏳ next | full |
| 11 | **SURG-001** General Surgery | 1 | ⏳ next | full |
| 12 | **NEURO-001** Neurology | 1 | ⏳ next | full |
| 13 | **ORTHO-001** Orthopedics | 1 | ⏳ next | full |
| 14 | **OPHTH-001** Ophthalmology | 1 | ⏳ next | full |
| 15 | **ENT-001** Otolaryngology | 1 | ⏳ next | full |
| 16 | **URO-001** Urology | 1 | ⏳ next | full |
| 17 | **ANES-001** Anesthesia | 1 | ⏳ next | full |
| 18 | **ICU-001** Intensive Care | 1 | ⏳ next | full |
| 19 | **PSYC-001** Psychiatry | 1 | ⏳ next | full |
| 20 | **RHEUM-001** Rheumatology | 2 | ⏳ next | full |

**Effective**: 20 × 60 = 1,200 files in Tier-1 batch.

---

## Tier mapping

See `MASTER_CATALOG_v3.yaml` — used by the AUTOPILOT batch runner.

---

## Per-dept delivery format

For each dept, the 60 files are organized:

```
.ai-brain/02_MODULES_NEW/TIER1_<DEPT_ID>/
├── 00_README.md                                      # entry point
├── 01_clinical_workflows.md                          # CMO domain
├── 02_sub_dept_catalog.md                            # sub-departments
├── 03_icd10_snomed_map.md                            # terminology
├── 04_clinical_red_flags.md                          # red flag DB
├── 05_prompt_engineering.md                          # AIE prompts
├── 06_system_prompt.md                               # system base
├── 07_context_window.md                              # context shape
├── 08_workflow_orchestration.md                      # LangGraph
├── 09_langchain_chains.md                            # chains
├── 10_rag_chains.md                                  # RAG chains
├── 11_vector_store_schema.md                         # vector
├── 12_llm_prompts.md                                 # compiled prompts
├── 13_llm_observability.md                           # observability
├── 14_engine_module.md                               # engine
├── 15_routes_api.md                                  # API
├── 16_middleware_chain.md                            # middleware
├── 17_data_flow.md                                   # data flow
├── 18_erd_diagram.md                                 # ERD
├── 19_openapi_spec.md                                # OpenAPI
├── 20_architecture_decision_record.md                # ADR
├── 21_dbml_schema.md                                 # DBML
├── 22_migration_up.sql                               # migration up
├── 23_migration_down.sql                             # migration down
├── 24_migration_validate.sql                         # validation
├── 25_seed_data.sql                                  # seed
├── 26_stitch_layout.md                               # UI layout
├── 27_wireframes.md                                  # wireframes
├── 28_i18n_keys.md                                   # i18n keys
├── 29_design_tokens.md                               # tokens
├── 30_user_stories.md                                # stories
├── 31_acceptance_criteria.md                         # AC
├── 32_business_flow.md                               # flow
├── 33_api_rbac_defense_in_depth.md                   # RBAC
├── 34_penetration_test_plan.md                       # pentest
├── 35_security_plan.md                               # security
├── 36_secrets_management.md                          # secrets
├── 37_deployment_runbook.md                          # deploy
├── 38_ci_cd_pipeline.md                              # CI/CD
├── 39_monitoring_alerting.md                         # monitoring
├── 40_backup_restore_dr.md                           # DR
├── 41_incident_response.md                           # IR
├── 42_jci_checklist.md                               # JCI
├── 43_iso_9001_checklist.md                          # ISO 9001
├── 44_pdpl_dpia.md                                   # DPIA
├── 45_nphies_zatca_map.md                            # NPHIES/ZATCA
├── 46_consent_forms.md                               # consent
├── 47_legal_contracts.md                             # legal
├── 48_audit_trail_design.md                          # audit
├── 49_unit_tests.md                                  # unit
├── 50_integration_tests.md                           # integration
├── 51_e2e_tests.md                                   # e2e
├── 52_test_plan.md                                   # test plan
├── 53_user_manual.md                                 # user manual
├── 54_training_video_script.md                       # training script
├── 55_helpdesk_runbook.md                            # helpdesk
├── 56_budget_token_cost.md                           # cost
├── 57_task_tracking.md                               # tasks
├── 58_seo_optimization.md                            # SEO
├── 59_go_to_market.md                                # GTM
└── 60_closeout.md                                    # closeout
```

---

## PULM-001 (the example)

See `.ai-brain/02_MODULES_NEW/TIER1_PULM-001/` — **61 files** (00-60) shipped 2026-08-01.

---

## Recipe to fill other depts

For each remaining Tier-1 dept:

```bash
# Per dept loop:
loop = Discover → Plan → Build → Test → Verify (5 loops max 4 iters)
build = apply TPL:DEPT, generate 60 files with snippets_v2 + token-saver pack
```

Use `nm-autopilot-upgrade` skill with `mode=MODE_2`.

---

## Acceptance per dept

- ✅ All 60 files present + complete (no truncation)
- ✅ No hardcoded secrets
- ✅ Tier-1 features: full 60 files
- ✅ Compliance mapped (CBAHI + NPHIES + PDPL + JCI where applicable)
- ✅ Tests stubs in 49-52 + ready to run
- ✅ Signoff from CMO + CQO before status="production"

---

## Status tracking

| Phase | Files complete | Status |
|-------|----------------|--------|
| Tier-1 batch phase 1 | 2/20 (CARD, PULM) | ✅ |
| Tier-1 batch phase 2 | 18 more | ⏳ next |
| Tier-2 batch | 40 | ⏳ |
| Tier-3 batch | 40 | ⏳ |
| Tier-4 batch | 20 | ⏳ |

---

*Owner: ORC — version 1.0 — 2026-08-01*
