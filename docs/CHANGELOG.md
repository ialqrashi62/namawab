# Changelog
All notable changes to this project will be documented here.
The format is based on Keep a Changelog; this project adheres to Semantic Versioning.

## [Unreleased]

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
