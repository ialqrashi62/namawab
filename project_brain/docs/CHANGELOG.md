# Changelog
All notable changes to this project will be documented here.
The format is based on Keep a Changelog; this project adheres to Semantic Versioning.

## [Unreleased]

### Added — 2026-06-19
- Implementation of Tenant Isolation and Row-Level Security (RLS) for `nursing_assessments` table on Staging:
  - Database Schema Alteration: Added `tenant_id` (NOT NULL) and `facility_id` (nullable) columns to `nursing_assessments` table.
  - Database Security: Enabled and forced Row-Level Security (RLS) on `nursing_assessments` and applied `rls_nursing_assessments_tenant_isolation` policy scoped to the active tenant.
  - Composite Index: Created `idx_nursing_assessments_tenant_facility` composite index for optimized query performance under RLS.
  - Express.js API Hardening: Scoped GET and POST endpoints in `server.js` to utilize the tenant context directly, preventing IDOR vulnerabilities.
  - Database Init Sync: Updated `db_postgres.js` to automatically handle column alterations and backfill for `nursing_assessments` during database startup.
  - Automated Isolation Test: Developed `cross_tenant_nursing_assessments_test.js` covering GET/POST multi-tenant isolation, data leak protection, and IDOR prevention (8 test cases passing).
  - Documentation Suite: Authored full reports in `docs/` detailing preflight audit, backup, truth validation, schema change execution, API hardening, test automation, regression validation, rollback readiness, and security readiness.


### Added — 2026-05-13
- Initial comprehensive blueprint suite (`docs/`):
  - 40 department spec files (G01–G40)
  - Master blueprint, ready prompt pack, per-dept template
  - Cross-cutting: design tokens, i18n base, OpenAPI components, LangGraph base
  - CI/CD workflow, security baseline, compliance map, C4 architecture, Helm skeleton, risk register
  - Legal pack: Privacy Policy (AR/EN), ToS, DPA, 10 consent templates, Patient Bill of Rights, Data Retention, AUP
  - Operational runbooks: DR, IR, ransomware, PHI breach, on-call
  - AI governance: policy, model card template + Cardio-ECG model card, risk assessment template
  - Dev tooling: docker-compose, Makefile, pre-commit, editorconfig, Dockerfile.python, pyproject, package.json, .gitignore, .dockerignore
  - Per-dept artifacts: OpenAPI (cardio + ed + template), seeders (cardio + ed + template), migrations (cardio + ed + icu + lab + rad), ERD DBML (cardio + ed + template), i18n (cardio + ed), test plans (cardio + ed + template)
  - BPMN: cardio_stemi, ed_triage, ed_sepsis_bundle, obgyn_labor_partograph, onc_chemo_cycle_signoff, icu_admission_pathway
  - Postman collection
  - SDK examples (Python + TypeScript)
  - Quality: KPI catalog, SLA, CBAHI evidence index
  - Glossary (AR/EN)
  - Repo meta: CONTRIBUTING, SECURITY, SUPPORT, CODE_OF_CONDUCT, CHANGELOG

### Notes
- Existing portal code (`AppServerPortal/`) and Qt application (`mainwindow.cpp`) remain unchanged.
- New `docs/` is a planning/specification layer; implementation will land service-by-service per roadmap.
