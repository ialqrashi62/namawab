# TIER3_CARD-301_STROKE — Stroke Center

> **Status**: L1 DRAFT — Pilot ready
> **Files**: 51/51
> **Last updated**: 2026-08-15

## Overview

Comprehensive Stroke Center (CSC) per AHA/ASA 2019 guidelines. Supports the full stroke care pathway from acute ischemic stroke (AIS) to intracranial hemorrhage (ICH), subarachnoid hemorrhage (SAH), transient ischemic attack (TIA), and post-stroke secondary prevention.

## Compliance

- ✅ AHA/ASA 2019 Guidelines
- ✅ CBAHI Standards
- ✅ Saudi MoH Stroke Program 2024 (Tenecteplase approved)
- ✅ NPHIES bundles
- ✅ PDPL consent
- ✅ ZATCA Phase 2
- ✅ SFDA registration

## Special Features

- **Code Stroke activation** — Door-to-Needle tracking (≤60 min target)
- **NIHSS automated scoring** — 13 subscores → 0-42 with severity
- **ASPECTS scoring** — 10-region CT evaluation
- **mRS** — Functional outcome (0-6)
- **ICH Score** — Mortality risk (0-6)
- **Hunt-Hess** — SAH grade (1-5)
- **ABCD2** — TIA risk (0-7)
- **CHA2DS2-VASc** — AF stroke risk
- **HAS-BLED** — Bleeding risk on anticoagulation
- **Tenecteplase dosing** — Saudi MoH 0.25 mg/kg, max 25 mg
- **Thrombolysis eligibility** — 11 contraindication checks
- **Thrombectomy tracking** — TICI score, mRS at 30 days
- **Secondary prevention bundle** — 5-element check
- **30-day follow-up** — mRS + recurrence tracking
- **Multi-locale** — AR/EN/FR/UR (50+ keys each)
- **RAG pipeline** — AHA/ASA + MoH knowledge base
- **Vector store** — pgvector + HNSW index

## File Inventory (51 files)

| # | File | Purpose |
|---|---|---|
| 1 | 01_prompt_engineering.md | Specialty prompt |
| 2 | 02_system_prompt.md | LLM guardrails |
| 3 | 03_context_schema.yaml | Patient/encounter context |
| 4 | 04_workflow_orchestration.md | Phase 1-8 workflow |
| 5 | 05_langchain_chains.py | 4 RAG chains |
| 6 | 06_chaining_patterns.md | 8 chaining patterns |
| 7 | 07_vector_mine_strategy.md | Chunking + RAG |
| 8 | 08_engine.js | 11 pure functions |
| 9 | 09_router.js | 17 endpoints |
| 10 | 10_data_model.md | 5 tables schema |
| 11 | 11_migration_up.sql | FORCE RLS DDL |
| 12 | 12_migration_down.sql | DROP RLS DDL |
| 13 | 13_vector_table.sql | pgvector + seed |
| 14 | 14_rag_pipeline.js | RAG pipeline |
| 15 | 15_stitch_index.html | Dashboard |
| 16 | 16_stitch_detail.html | Case detail |
| 17 | 17_stitch_form.html | Code Stroke form |
| 18 | 18_stitch_chart.html | GWTG-S chart |
| 19 | 19_digital_assets.md | Icons + illustrations |
| 20 | 20_infrastructure_dockerfile | Container |
| 21 | 21_pm2.json | PM2 config |
| 22 | 22_cicd_workflow.yml | CI/CD |
| 23 | 23_unit_test.js | 25 unit tests |
| 24 | 24_integration_test.js | 4 integration tests |
| 25 | 25_bdd_feature.feature | 10 BDD scenarios |
| 26 | 26_business_flow.md | BPMN phases |
| 27 | 27_wireframes.md | 4 wireframes |
| 28 | 28_erd.md | Mermaid ERD |
| 29 | 29_openapi.yaml | OpenAPI 3.0 spec |
| 30 | 30_user_stories.md | 8 user stories |
| 31 | 31_test_cases.md | 31 test cases |
| 32 | 32_architecture.md | Component diagram |
| 33 | 33_security_threat_model.md | STRIDE |
| 34 | 34_deployment_runbook.md | Deploy steps |
| 35 | 35_style_guide.json | MD3 tokens |
| 36 | 36_i18n_ar.json | AR translations |
| 37 | 37_i18n_en.json | EN translations |
| 38 | 38_i18n_fr.json | FR translations |
| 39 | 39_i18n_ur.json | UR translations |
| 40 | 40_seeder.js | Dummy data |
| 41 | 41_user_manual_ar.md | دليل المستخدم |
| 42 | 42_user_manual_en.md | User manual |
| 43 | 43_training_video_storyboard.md | 4 videos |
| 44 | 44_legal_compliance_checklist.md | PDPL/CBAHI |
| 45 | 45_sprint_plan.md | 7 sprints |
| 46 | 46_task_tracking.csv | 50 tasks |
| 47 | 47_budget_tokens.md | Token budget |
| 48 | 48_apm_rules.yml | Prometheus |
| 49 | 49_user_analytics.json | PostHog |
| 50 | 50_llm_observability.md | LangSmith |
| 51 | 51_seo_schema.json | schema.org |

## Quality Gates (6/6)

- [x] G1: Tests — 25 unit + 4 integration + 10 BDD
- [x] G2: Security — STRIDE threat model + no PHI in logs
- [x] G3: RLS — FORCE on all 5 tables + 1 vector table
- [x] G4: i18n — 4 locales (AR/EN/FR/UR) with 50+ keys
- [x] G5: RBAC — 7-tier Golden Access Rule, role middleware
- [x] G6: Deploy — Runbook + rollback plan

## Live Wire-Up (next wave)

```bash
# 1. Copy engine + router
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/tier3_card_301_stroke_engine.js \
  namaweb/stroke_router.js \
  root@204.168.144.74:/var/www/namaweb/

# 2. Mount in server.js
# try { app.use('/api/stroke', require('./stroke_router')); } catch(e) { console.error('stroke mount failed', e.message); }

# 3. Apply migrations
psql -U nama_medical_app -d nama_medical_web -f migrations/tier3_card_301_stroke_*.sql

# 4. Reload
ssh -i C:\Users\ice\.ssh\nama_medical_key root@204.168.144.74 \
  "cd /var/www/namaweb && pm2 reload nama-medical-erp --silent"
```

## Next Steps

1. **Cardio-Oncology (TIER3_CARD-303)** — Same pattern, 51 files
2. **Advanced Heart Failure (TIER3_CARD-302)** — Same pattern, 51 files
3. **Gap closer: Patient Portal Mobile** — Next batch
