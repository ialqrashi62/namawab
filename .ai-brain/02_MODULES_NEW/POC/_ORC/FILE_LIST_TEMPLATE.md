<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# FILE_LIST_TEMPLATE — 35 Files per Department

> **Pattern source:** `.ai-brain/02_MODULES/ER-001/` (General ER, 35 files, L4-validated).
> **Apply to:** CARD-002, NEPH-002, ER-002.
> **Naming convention:** NN_prefix_topic.md (e.g. `01_clinical_workflows.md`, `02_openapi_spec.md`).
> **Specialization rule:** Keep the file NAMES identical across depts; specialize the CONTENT to the dept.

---

## The 35-File Template

| # | File | Section | Description | Source ref |
|---|------|---------|-------------|------------|
| 1 | `README.md` | Front matter | Module ID, name, parent, code, owners (CMO/AIE/CQO), L4 status | `ER-001/README.md` |
| 2 | `00_synthesis.md` | L1-L4 | 7-Expert Panel synthesis (CMO + AIE + SA + DSL + PM + CQO + ORC) | `MASTER_PROMPT_v3.md` |
| 3 | `01_clinical_workflows.md` | CMO voice | Top 10 conditions + top 20 procedures + red flags + workflow + time targets | CONTEXT_BRIEFS §2 |
| 4 | `01_dbml_schema.md` | SA voice | ERD in dbdiagram.io DBML format; tables + relationships | CONTEXT_BRIEFS §4.1 |
| 5 | `01_jci_checklist.md` | CQO voice | JCI 7th Ed mapping (ACC/COP/MMU/QPS/SQE/MOI/PCI/FMS) | CONTEXT_BRIEFS §6 |
| 6 | `01_migration_up.sql` | SA voice | PostgreSQL DDL: CREATE TABLE + RLS + FORCE RLS + tenant_id | CONTEXT_BRIEFS §4.1 + SNIP-02 |
| 7 | `01_rag_chains.md` | AIE voice | LangChain/LangGraph chains (7 chains per dept) | CONTEXT_BRIEFS §3.3 |
| 8 | `01_stitch_layout.md` | PM voice | 3-column Stitch station layout (left/center/right) | CONTEXT_BRIEFS §5 + SNIP-04 |
| 9 | `01_unit_tests.md` | Tests | Unit tests for the pure JS engine (deterministic) | CONTEXT_BRIEFS §8 |
| 10 | `01_user_manual.md` | Docs | EN + AR user manual (operator + patient views) | ER-001 reference |
| 11 | `02_integration_tests.md` | Tests | Integration tests (supertest for API endpoints) | ER-001 reference |
| 12 | `02_iso_9001_checklist.md` | CQO voice | ISO 9001:2015 QMS mapping (processes, audits, NCR) | ER-001 reference |
| 13 | `02_migration_down.sql` | SA voice | DROP TABLE (non-destructive; order matters for FKs) | CONTEXT_BRIEFS §4.1 |
| 14 | `02_openapi_spec.md` | SA voice | OpenAPI 3.1 spec (all endpoints in `/api/{dept}/`) | CONTEXT_BRIEFS §4.2 |
| 15 | `02_sub_dept_catalog.md` | PM voice | Sub-departments / sub-units (e.g. cath lab rooms) | CONTEXT_BRIEFS §5.1 |
| 16 | `02_training_video_script.md` | Docs | EN + AR training video script (3-min per topic) | ER-001 reference |
| 17 | `02_vector_store_schema.md` | AIE voice | PGVector 768d schema; chunking; hybrid retrieval weights | CONTEXT_BRIEFS §3.2 |
| 18 | `02_wireframes.md` | PM voice | Screen flows (low-fi ASCII + high-fi Stitch exports) | CONTEXT_BRIEFS §5 |
| 19 | `03_e2e_tests.md` | Tests | E2E tests (Gherkin + Playwright for critical paths) | CONTEXT_BRIEFS §1.4 |
| 20 | `03_engine_module.md` | SA voice | Pure JS engine (the 10 functions from §8 of brief) | CONTEXT_BRIEFS §8 |
| 21 | `03_i18n_keys.md` | PM voice | i18n keys (AR + EN) — dept-specific additions to SNIP-12 | ER-001 reference |
| 22 | `03_icd10_snomed_map.md` | CMO voice | ICD-10 + SNOMED-CT + LOINC + RxNorm codes for dept | CONTEXT_BRIEFS §2.1 + §2.2 |
| 23 | `03_legal_consent_forms.md` | CQO voice | 10 consent types (treatment, procedure, data, AI, research...) | SNIP-09 + ER-001 |
| 24 | `03_llm_prompts.md` | AIE voice | System prompt + 3+ few-shot examples per chain | CONTEXT_BRIEFS §3.4 |
| 25 | `03_migration_validate.sql` | SA voice | Validation queries (RLS test, FK check, row count) | SNIP-02 |
| 26 | `03_pdpl_nphies.md` | CQO voice | PDPL retention + NPHIES bundles + ZATCA + SFDA | CONTEXT_BRIEFS §6 |
| 27 | `04_clinical_red_flags.md` | CMO voice | Red flag catalog (5+ items; trigger/response/time) | CONTEXT_BRIEFS §2.3 |
| 28 | `04_design_tokens.md` | PM voice | Stitch design tokens (colors, typography, spacing) | SNIP-04 + DESIGN_SYSTEM |
| 29 | `04_helpdesk_runbook.md` | DSL voice | L1/L2/L3 support runbook (FAQs, escalation) | ER-001 reference |
| 30 | `04_llm_observability.md` | AIE voice | LangSmith + Helicone + drift monitoring + eval | SNIP-11 + AI_OBSERVABILITY |
| 31 | `04_routes_api.md` | SA voice | Express routes (file per dept; middleware chain) | CONTEXT_BRIEFS §4.2 + §4.3 |
| 32 | `05_middleware_chain.md` | DSL voice | Middleware order + data flow + RLS at app layer | SNIP-02 + SNIP-05 |
| 33 | `06_data_flow.md` | SA voice | End-to-end data flow (Mermaid diagram + RLS points) | CONTEXT_BRIEFS §4.3 |
| 34 | `07_erd_diagram.md` | SA voice | ERD (PlantUML or Mermaid) + tenant_id on every entity | CONTEXT_BRIEFS §4.1 |
| 35 | `08_architecture_decision_record.md` | SA voice | 5 ADRs (stack, RLS, idempotency, LLM choice, observability) | ER-001 reference |

---

## Per-dept differentiation

| Dept | Engine file | Tables | Endpoints | LangChain chains | Red flags | KPI |
|---|---|---|---|---|---|---|
| **CARD-002** | `cath_lab_engine.js` | 12 | 23 | 8 | 12 | door-to-balloon ≤90 min |
| **NEPH-002** | `transplant_engine.js` | 13 | 26 | 6 | 12 | 1-yr graft survival ≥95% (LRD) |
| **ER-002** | `trauma_center_engine.js` (extends existing `trauma_score_engine.js`) | 14 | 22 | 7 | 12 | door-to-OR ≤15 min |

---

## Cross-cutting references (use `$ref`)

| Concern | Source |
|---|---|
| RLS / tenant isolation | `.ai-brain/02_MODULES_NEW/POC/_ORC/SNIPPETS.md#SNIP-02` |
| PHI vault | `SNIPPETS.md#SNIP-03` |
| Stitch 3-column layout | `SNIPPETS.md#SNIP-04` |
| Golden Access Rule | `SNIPPETS.md#SNIP-05` |
| Money/VAT server-side | `SNIPPETS.md#SNIP-06` |
| Idempotency guard | `SNIPPETS.md#SNIP-07` |
| Hash-chained audit | `SNIPPETS.md#SNIP-08` |
| Safety gates | `SNIPPETS.md#SNIP-09` |
| CSP report-only | `SNIPPETS.md#SNIPPETS.md#SNIP-10` |
| LLM observability | `SNIPPETS.md#SNIP-11` |
| Common i18n | `SNIPPETS.md#SNIP-12` |
| 13 safety rails | `SNIPPETS.md#SNIP-01` |
| Master prompt v3 | `.ai-brain/00_SYSTEM/MASTER_PROMPT_v3.md` |
| Compliance core | `.ai-brain/05_SHARED/COMPLIANCE_CORE.yaml` |
| Design system | `.ai-brain/05_SHARED/DESIGN_SYSTEM.yaml` |
| AI observability | `.ai-brain/06_SHARED/AI_OBSERVABILITY.yaml` |
| Catalog (186 depts) | `.ai-brain/01_DATA/CATALOG.yaml` |

---

## ORC sign-off
35-file template ready. 3 modules may now generate. — ORC, 2026-07-24
