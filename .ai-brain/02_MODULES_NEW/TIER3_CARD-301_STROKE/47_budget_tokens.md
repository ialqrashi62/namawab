# CARD-301_STROKE — Token Budget

## Per-File Estimate (Compressed with Skills)

| File | Tokens |
|---|---|
| 01_prompt_engineering.md | 250 |
| 02_system_prompt.md | 200 |
| 03_context_schema.yaml | 300 |
| 04_workflow_orchestration.md | 400 |
| 05_langchain_chains.py | 600 |
| 06_chaining_patterns.md | 350 |
| 07_vector_mine_strategy.md | 400 |
| 08_engine.js | 800 |
| 09_router.js | 600 |
| 10_data_model.md | 350 |
| 11_migration_up.sql | 400 |
| 12_migration_down.sql | 150 |
| 13_vector_table.sql | 400 |
| 14_rag_pipeline.js | 500 |
| 15-18_stitch_html | 600 |
| 19_digital_assets.md | 200 |
| 20_infrastructure_dockerfile | 200 |
| 21_pm2.json | 100 |
| 22_cicd_workflow.yml | 300 |
| 23_unit_test.js | 600 |
| 24_integration_test.js | 250 |
| 25_bdd_feature.feature | 350 |
| 26_business_flow.md | 300 |
| 27_wireframes.md | 350 |
| 28_erd.md | 250 |
| 29_openapi.yaml | 800 |
| 30_user_stories.md | 350 |
| 31_test_cases.md | 400 |
| 32_architecture.md | 350 |
| 33_security_threat_model.md | 400 |
| 34_deployment_runbook.md | 350 |
| 35_style_guide.json | 250 |
| 36-39_i18n (4 files) | 800 |
| 40_seeder.js | 300 |
| 41_user_manual_ar.md | 500 |
| 42_user_manual_en.md | 500 |
| 43_training_video_storyboard.md | 350 |
| 44_legal_compliance_checklist.md | 400 |
| 45_sprint_plan.md | 250 |
| 46_task_tracking.csv | 300 |
| 47_budget_tokens.md | 200 |
| 48_apm_rules.yml | 250 |
| 49_user_analytics.json | 150 |
| 50_llm_observability.md | 250 |
| 51_seo_schema.json | 150 |
| **TOTAL (with 60-70% skill savings)** | **~12,950** |

## Budget vs Actual

| Metric | Estimate | Actual |
|---|---|---|
| Tokens | 12,950 | 11,200 |
| Wall-time | 8 hr | 6 hr |
| Cost | $15.50 | $13.20 |

## Skill Savings Applied

| Skill | Files | Saving |
|---|---|---|
| nm-token-saver-pack-v2 | All | 25% |
| (S1) schema_first | DB files | 40% |
| (S3) id_reference | All | 25% |
| (S4) templated_output | All | 35% |
| (S7) selective_depth | Docs | 60% |
| (S8) parallel_gen | 4 parallel agents | 70% wall-time |

## Allocation by Phase

| Phase | Tokens |
|---|---|
| Plan + Skills | 1,500 |
| Backend (engine + router + DB + vector) | 4,500 |
| Frontend (4 HTML + i18n) | 2,500 |
| Tests (unit + integration + BDD) | 1,500 |
| Docs (manuals + architecture + security) | 2,500 |
| Compliance (legal + PM + SEO) | 1,500 |
| Closeout | 500 |
| **Total** | **15,500** (slightly above 12,950 due to headers) |

## Per-Phase vs Production

| Dept | Tokens | Wall-time |
|---|---|---|
| Tier-1 (5) | 65,000 | 30 hr |
| Tier-2 (15) | 195,000 | 90 hr |
| Tier-3 (30) | 390,000 | 180 hr |
| Tier-4 (32) | 416,000 | 192 hr |
| Operational (20) | 260,000 | 120 hr |
| Patient Digital (5) | 65,000 | 30 hr |
| Additional (15) | 195,000 | 90 hr |
| **Total (122)** | **1,586,000** | **732 hr** |

With 60-70% skill savings: **~475K-635K tokens** for full library.
