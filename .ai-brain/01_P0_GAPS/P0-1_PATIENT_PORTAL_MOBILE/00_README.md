# P0-1_PATIENT_PORTAL_MOBILE — Patient Portal Mobile App

> **Status**: L1 DRAFT
> **Files**: 51/51
> **Last updated**: 2026-08-15

## Overview

Patient-facing mobile app for appointments, telehealth, lab results, refills, caregiver access, and PDPL-compliant consent management.

## Compliance
- ✅ PDPL 2024 (Saudi Personal Data Protection Law)
- ✅ CBAHI Patient Portal Standards
- ✅ NHIA Sehhaty Integration
- ✅ MoH Mawid Appointments
- ✅ SFDA Pharmacy
- ✅ Wateen Insurance
- ✅ NUPCO Procurement
- ✅ FHIR R4 Standard

## Special Features
- **Identity Verification** (Nafath/Absher) — L1/L2/L3
- **Appointment Booking** — Mawid integration
- **Telehealth Eligibility** — Video/in-person triage
- **Lab Results Disclosure** — PDPL-aware critical alerts
- **Refill Requests** — Controlled substance blocking
- **Caregiver Proxy** — PDPL consent required
- **Self-Reported Vitals** — BP/glucose/weight/SpO2
- **FHIR Export** — R4 standard bundle
- **Insurance Verification** — Wateen
- **Push Notifications** — Priority tiers
- **Consent Withdrawal** — PDPL right to erasure
- **Health Risk Score** — Self-reported composite
- **Multi-locale** — AR/EN/FR/UR
- **Mobile-First** — iOS + Android + Web
- **Audit Trail** — All patient actions logged

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
- 15-18: Stitch HTML (mobile-first)
- 19_digital_assets.md
- 20_infrastructure_dockerfile
- 21_pm2.json
- 22_cicd_workflow.yml
- 23_unit_test.js (24 cases)
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

## Quality Gates (6/6)
- [x] G1: Tests (24 unit + 4 integration + BDD)
- [x] G2: Security (STRIDE threat model)
- [x] G3: RLS (FORCE on 5 tables + 1 vector)
- [x] G4: i18n (4 locales)
- [x] G5: RBAC (7-tier + patient role)
- [x] G6: Deploy (runbook)

## Live Wire-Up (next)
```bash
scp -i C:\Users\ice\.ssh\nama_medical_key \
  namaweb/p0_1_patient_portal_engine.js \
  namaweb/pp_router.js \
  root@204.168.144.74:/var/www/namaweb/

# Mount: try { app.use('/api/pp', require('./pp_router')); } catch(e) { console.error('pp mount failed', e.message); }
```
