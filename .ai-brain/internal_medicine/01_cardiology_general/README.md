# Cardiology (General) — Department Blueprint

> **Department:** Cardiology (طب القلب العام)
> **Group:** Internal Medicine
> **Owner:** CMO + Cardiology Lead
> **Status:** 🟡 In Progress (Phase 3)
> **Created:** 2026-07-23
> **Last Updated:** 2026-07-23
> **Safety Rails:** All 13 from `AGENTS.md §2.2` apply

---

## 📋 Department Overview

The Cardiology department provides comprehensive care for cardiovascular diseases including coronary artery disease, heart failure, arrhythmias, valvular disease, and hypertension management. The NamaMedical platform delivers a full outpatient + inpatient + procedural workspace.

### Sub-Units (5)

1. **General Cardiology Clinic** — outpatient consults, ECG, echo, stress testing
2. **Heart Failure Clinic** — LVAD/transplant evaluation, GDMT optimization
3. **Arrhythmia Clinic** — EP consults, anticoagulation clinic
4. **Valvular Clinic** — pre/post TAVR, MitraClip follow-up
5. **Cardiac Rehab** — Phase I/II/III supervised programs

### Key Metrics (target)

| Metric | Target |
|---|---|
| 30-day heart failure readmit | < 15% |
| Door-to-balloon time (STEMI) | < 90 min |
| Door-to-needle time (stroke) | < 60 min |
| LVEF documentation rate | 100% |
| Statin prescription (CAD) | > 90% |

---

## 🗂 35-File Index

### Synthesis (2 files)
- `00_7_EXPERT_PANEL_SYNTHESIS.md` — 7-expert synthesis
- `README.md` — this file

### 01 Clinical Spec (4 files)
- `01_clinical_workflows.md` — patient journey + decision trees
- `02_sub_dept_catalog.md` — 5 sub-units detail
- `03_icd10_snomed_map.md` — diagnosis codes
- `04_clinical_red_flags.md` — emergency triggers

### 02 AI Orchestration (4 files)
- `01_rag_chains.md` — LangChain clinical copilot
- `02_vector_store_schema.md` — PGVector schema
- `03_llm_prompts.md` — system + user prompts
- `04_llm_observability.md` — Langfuse setup

### 03 Technical Arch (8 files)
- `01_dbml_schema.md` — DBML
- `02_openapi_spec.md` — OpenAPI 3.1
- `03_engine_module.md` — pure JS engines (10 functions)
- `04_routes_api.md` — Express routes
- `05_middleware_chain.md` — auth + tenant + RBAC
- `06_data_flow.md` — request → DB → response
- `07_erd_diagram.md` — mermaid ERD
- `08_architecture_decision_record.md` — ADR

### 04 DevOps (4 files)
- `01_migration_up.sql`
- `02_migration_down.sql`
- `03_migration_validate.sql`
- `04_cicd_runbook.md`

### 05 UX/UI (4 files)
- `01_stitch_layout.md` — Layout D (chart-heavy)
- `02_wireframes.md`
- `03_i18n_keys.md` — EN/AR labels
- `04_design_tokens.md` — color tokens

### 06 Compliance (3 files)
- `01_jci_checklist.md` — JCI 7th ed.
- `02_iso_9001_checklist.md`
- `03_pdpl_nphies.md`

### 07 Testing (3 files)
- `01_unit_tests.md`
- `02_integration_tests.md`
- `03_e2e_tests.md`

### 08 Operations (4 files)
- `01_user_manual.md`
- `02_training_video_script.md`
- `03_legal_consent_forms.md`
- `04_helpdesk_runbook.md`

**Total: 35 files per dept.**

---

## 🔑 7-Expert Panel Summary

| Expert | Top 3 inputs |
|---|---|
| **CMO** | ICD-10 I20-I52 mapping; ESC/AHA guidelines for chest pain, HF, AF; door-to-balloon KPI |
| **AI Engineer** | RAG over ESC guidelines + UpToDate; ECG interpretation chain; LLM-disclaimered copilot |
| **Architect** | Cluster `cardiology.dbml` (existing 12 tables + 4 new); new `cardiology_*` migrations `e50a-e51` |
| **DevOps** | Migration up/down/validate; PM2 reload; `node cardiology_engine_unit_test.js` |
| **UX** | Layout D (chart-heavy, rose color); 6 tabs (Consult, ECG, Echo, Cath, Meds, Notes) |
| **Compliance** | JCI ACC.1, ACC.2; ISO 9001 §7.5; PDPL consent for cardiac imaging; NPHIES bundle for HF |
| **Orchestrator** | 4-iteration loop; 10 engine functions; 12 routes; 3 Stitch screens |

---

## 🚦 Status Tracking

| Loop | Status | Notes |
|---|---|---|
| 1 — Plan | ✅ | Clinical + RAG done |
| 2 — Implement | 🟡 | Migration drafted |
| 3 — Test | ⏸ | pending |
| 4 — Verify | ⏸ | pending |

**Last commit:** TBD
**Last loop notes:** TBD
