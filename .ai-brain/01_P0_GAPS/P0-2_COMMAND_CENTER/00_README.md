# P0-2_COMMAND_CENTER — Hospital Command Center

> **Status**: L1 DRAFT
> **Files**: 51/51
> **Last updated**: 2026-08-15

## Overview

Real-time hospital command center dashboard per MoH Saudi Arabia operations standards. Provides bed management, ED capacity, OR scheduling, mass casualty, surge planning, and resource optimization.

## Compliance
- ✅ MoH Saudi Hospital Operations
- ✅ CBAHI Operational Standards
- ✅ NPHIES Real-time Reporting
- ✅ SCFHS Staff Allocation
- ✅ SFDA Drug Availability

## Special Features
- **Bed Management** — Real-time availability
- **ED Capacity** — Surge detection
- **OR Scheduling** — Throughput optimization
- **Mass Casualty** — MCI protocol
- **Resource Optimization** — Staff + equipment
- **Patient Flow** — Bottleneck detection
- **Multi-locale** — AR/EN/FR/UR
- **RAG Pipeline** — MoH guidelines
- **Vector Store** — pgvector + HNSW

## Files (51)
- 00_README.md (this file)
- 01_prompt_engineering.md
- 02_system_prompt.md
- 03_context_schema.yaml
- 04_workflow_orchestration.md
- 05_langchain_chains.py
- 06_chaining_patterns.md
- 07_vector_mine_strategy.md
- 08_engine.js (12 pure functions)
- 09_router.js (12 endpoints)
- 10_data_model.md
- 11_migration_up.sql (5 tables)
- 12_migration_down.sql
- 13_vector_table.sql
- 14_rag_pipeline.js
- 15-18: Stitch HTML
- 19_digital_assets.md
- 20_infrastructure_dockerfile
- 21_pm2.json
- 22_cicd_workflow.yml
- 23_unit_test.js
- 24_integration_test.js
- 25_bdd_feature.feature
- 26_business_flow.md
- 27_wireframes.md
- 28_erd.md
- 29_openapi.yaml
- 30_user_stories.md
- 31_test_cases.md
- 32_architecture.md
- 33_security_threat_model.md
- 34_deployment_runbook.md
- 35_style_guide.json
- 36-39: i18n (AR, EN, FR, UR)
- 40_seeder.js
- 41_user_manual_ar.md
- 42_user_manual_en.md
- 43_training_video_storyboard.md
- 44_legal_compliance_checklist.md
- 45_sprint_plan.md
- 46_task_tracking.csv
- 47_budget_tokens.md
- 48_apm_rules.yml
- 49_user_analytics.json
- 50_llm_observability.md
- 51_seo_schema.json

## Live Wire-Up (next)
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/p0_2_command_center_engine.js \
  namaweb/cc_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/cc', require('./cc_router')); } catch(e) { console.error('cc mount failed', e.message); }
```
