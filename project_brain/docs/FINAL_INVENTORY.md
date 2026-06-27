# NamaMedical — Final Inventory
> Snapshot of everything produced in `docs/` as of 2026-05-13.

## Top-level files
- 00_Master_Blueprint.md
- TEMPLATE_per_department.md
- READY_PROMPT_PACK.md
- GLOSSARY.md
- README.md, FINAL_INVENTORY.md, CHANGELOG.md
- CONTRIBUTING.md, SECURITY.md, SUPPORT.md, CODE_OF_CONDUCT.md

## groups/ — 40 medical groups
G01_cardiology … G40_rare_advanced (each ~5–10K chars, 23 deliverables).

## backend-skeleton/ (13 files — FastAPI cardio-api)
- app/main.py, settings.py
- app/api/{__init__.py, router_health.py, router_orders.py, router_ai.py}
- app/db/{session.py, models.py}
- app/schemas/cardio.py
- app/security/{auth.py, middleware.py}
- app/services/{repository.py, risk_calculators.py}
- app/events/publisher.py
- tests/{test_risk_calculators.py, test_orders_api.py}
- README.md

## frontend-skeleton/ (12 files — React 19)
- src/main.tsx, App.tsx, index.css
- src/lib/{api.ts, i18n.ts}
- src/stores/auth.ts
- src/hooks/useCardio.ts
- src/components/{AppShell.tsx, ProtectedRoute.tsx, PatientHeader.tsx, OrderSheet.tsx, AINotePad.tsx, LangToggle.tsx}
- tailwind.config.ts
- README.md

## design-system/
- tokens.json (W3C-DTCG)

## i18n/
- ar.base.json, en.base.json
- cardiology.{ar,en}.json
- ed.{ar,en}.json
- (auto-generated stubs for other depts)

## openapi/
- components.base.yaml
- _template.yaml, cardiology.yaml, ed.yaml
- (auto-generated stubs)

## orchestration/
- langgraph_base.py — DeptOrchestrator base + Cardio example

## erd/
- _template.dbml, cardiology.dbml, ed.dbml
- (auto-generated stubs)

## migrations/
- cardiology/V001__cardio_core_tables.sql, V002__hf_program_devices.sql
- ed/V001__ed_core.sql, V002__ed_codes_bundles.sql
- icu/V001__icu_core.sql
- lab/V001__lab_extensions.sql
- rad/V001__rad_core.sql
- (auto-generated 001_initial.sql for other depts)

## seeders/
- _template.sql, cardiology_seed.sql, ed_seed.sql

## bpmn/ (6 XML files)
- cardiology_stemi.bpmn
- ed_triage.bpmn, ed_sepsis_bundle.bpmn
- obgyn_labor_partograph.bpmn
- onc_chemo_cycle_signoff.bpmn
- icu_admission_pathway.bpmn

## tests/
- _template.md, cardiology_test_plan.md, ed_test_plan.md

## sdk/
- python/example.py
- typescript/example.ts

## postman/
- NamaMedical.postman_collection.json

## ci-cd/
- github-actions.yml

## iac/
- terraform/{main.tf, variables.tf, envs/{staging.tfvars, prod.tfvars}}
- kustomize/base/{kustomization.yaml, namespace.yaml, networkpolicy-default-deny.yaml, resourcequota.yaml, limitrange.yaml}
- kustomize/overlays/{staging,prod}/kustomization.yaml
- README.md

## devops/
- helm_chart_skeleton.md

## dev-tooling/
- docker-compose.dev.yml, Makefile
- .pre-commit-config.yaml, .editorconfig, .gitignore, .dockerignore
- Dockerfile.python, pyproject.toml, package.json
- prometheus.yml, .env.example

## observability/
- prometheus/{alerts.yml, slo.yml}
- grafana/{dashboard_platform_overview.json, dashboard_ed_live_board.json, dashboard_ai_quality.json}
- README.md

## db-ops/
- db_runbook.md
- dr-promote-mssql.sh, dr-dns-flip.sh
- backup-verify.sh
- deploy-blue-green.sh
- smoke.sh

## perf/
- k6_smoke.js, k6_orders_load.js, k6_ed_board_sse.js, k6_ai_copilot.js
- README.md

## security/
- security_baseline.md

## compliance/
- compliance_map.md

## risk/
- enterprise_risk_register.md

## ai-governance/
- policy.md
- model_card_template.md, model_card_cardio_ecg.md
- risk_assessment_template.md

## legal/
- privacy_policy_ar.md, privacy_policy_en.md
- terms_of_service.md
- dpa_template.md
- consents.md
- patient_bill_of_rights.md
- data_retention_policy.md
- acceptable_use_policy.md

## runbooks/
- disaster_recovery.md
- incident_response.md
- ransomware_playbook.md
- phi_breach_playbook.md
- oncall.md

## clinical/
- order_sets.yaml
- cds_rules.yaml
- smart_phrases.md
- README.md

## integrations/
- nphies.md
- wasfaty.md
- mawid_sehhaty_yaqeen.md
- zatca_einvoice.md
- shahm_937_emergency.md
- README.md

## quality/
- kpi_catalog.md
- sla.md
- cbahi_evidence_index.md

## faq/
- patient_faq_ar.md, patient_faq_en.md
- clinician_faq.md

## demos/
- demo_script_ed_stemi.md
- demo_script_icu_sepsis.md
- one_pager_executive.md
- one_pager_per_dept.md

## onboarding/
- facility_onboarding.md
- clinical_user_onboarding.md
- developer_onboarding.md
- admin_onboarding.md

## patient-portal/
- spec.md

## mobile/
- spec.md

## policies/
- whistleblower.md
- anti_bribery.md
- conflict_of_interest.md
- open_source_policy.md
- sustainability.md
- third_party_ai.md

## accessibility/
- wcag_aa_checklist.md
- rtl_guide.md
- testing_kit.md

## architecture/
- C4_overview.md

---

## Totals
- **40 group spec files**
- **~200 hand-written specification, code, config, and policy files**
- **~360 auto-generated per-dept stub files** (migrations, i18n, etc.)
- **~560 files total** across **24 logical sections**

## Production readiness checklist
- [x] Architecture documented (C4)
- [x] Backend skeleton runnable (cardio-api)
- [x] Frontend skeleton runnable (React)
- [x] CI/CD pipeline complete
- [x] Local dev stack (`make up`)
- [x] IaC (Terraform + Kustomize)
- [x] Observability (alerts + dashboards + SLOs)
- [x] Security baseline + STRIDE
- [x] Compliance map (PDPL/CBAHI/JCI/CAP/IAEA/SFDA/MoH)
- [x] AI governance (policy + model cards)
- [x] Runbooks (DR, IR, ransomware, PHI breach, on-call)
- [x] DB ops + DR bash scripts
- [x] Performance scripts (k6)
- [x] Legal pack (Privacy AR/EN, ToS, DPA, consents, BoR, retention, AUP)
- [x] Cross-cutting policies (whistleblower, anti-bribery, COI, OSS, sustainability, AI)
- [x] Accessibility kit (WCAG 2.2 AA + RTL)
- [x] FAQs (patient + clinician AR/EN)
- [x] Onboarding playbooks (facility, clinical, dev, admin)
- [x] Demos + sales one-pagers
- [x] Patient portal + mobile specs
- [x] KSA integration handbooks (NPHIES, Wasfaty, Mawid, Sehhaty, Yaqeen, ZATCA, Shahm)
- [x] Order sets + CDS rules + smart phrases
- [x] Quality (KPI catalog + SLA + CBAHI evidence)
- [x] SDK examples (Python + TypeScript)
- [x] Postman collection

---

## What still requires real-world work (not in scope of docs)
- Actual production data migration from legacy HIS (per facility).
- Per-facility branding, consent forms legal review.
- Clinical content review by each facility's medical board.
- SCFHS license verification keys per institution.
- NPHIES/Wasfaty/ZATCA production credentials onboarding.
- Pen-tests by approved external firms.
- CBAHI/JCI mock survey + actual survey.
- Change management for staff adoption.
- Hardware procurement (servers, devices, biomed integration).
