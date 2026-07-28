# nm-comprehensive-deliverables-checklist v2

> **Type:** verification / acceptance skill
> **Scope:** 60+ deliverables per department blueprint
> **Output:** binary pass/fail + missing-list

---

## Description

The single source of truth for "what must exist when a department blueprint is complete". Used by `nm-autopilot-dept-generator` at L5 (VERIFY) and by reviewers.

## When to use

- Before declaring a dept blueprint complete.
- During a quarterly audit.
- When a new reviewer / owner needs to know "did we deliver everything?".
- As the basis for `closeout.md`.

## The 60+ deliverables

### A. Core (required for every dept, all tiers)

| # | Deliverable | File | Tier |
|---|-------------|------|------|
| A1 | README | `00_README.md` | all |
| A2 | Clinical workflows | `01_clinical_workflows.md` | all |
| A3 | Red flags | `04_clinical_red_flags.md` | all |
| A4 | API routes | `15_routes_api.md` | all |
| A5 | Middleware chain | `16_middleware_chain.md` | all |
| A6 | Migration up | `22_migration_up.sql` | all |
| A7 | Migration down | `23_migration_down.sql` | all |
| A8 | Stitch layout | `26_stitch_layout.md` | all |
| A9 | i18n keys | `28_i18n_keys.md` | all |
| A10 | Design tokens | `29_design_tokens.md` | all |
| A11 | Closeout | `60_closeout.md` | all |
| A12 | Budget / token cost | `56_budget_token_cost.md` | all |
| A13 | Task tracking | `57_task_tracking.md` | all |

### B. Clinical (CMO)

| # | Deliverable | File | Tier |
|---|-------------|------|------|
| B1 | Sub-dept catalog | `02_sub_dept_catalog.md` | 1,2 |
| B2 | ICD-10 / SNOMED map | `03_icd10_snomed_map.md` | 1,2 |
| B3 | User stories | `30_user_stories.md` | 1,2,3 |
| B4 | Acceptance criteria | `31_acceptance_criteria.md` | 1,2,3 |
| B5 | Business flow | `32_business_flow.md` | 1,2 |
| B6 | User manual | `53_user_manual.md` | 1,2 |

### C. AI (AIE)

| # | Deliverable | File | Tier |
|---|-------------|------|------|
| C1 | Prompt engineering doc | `05_prompt_engineering.md` | 1,2 |
| C2 | System prompt | `06_system_prompt.md` | 1,2 |
| C3 | Context window strategy | `07_context_window.md` | 2,3 |
| C4 | Workflow orchestration | `08_workflow_orchestration.md` | 1,2 |
| C5 | LangChain chains | `09_langchain_chains.md` | 1,2 |
| C6 | RAG chains | `10_rag_chains.md` | 1,2 |
| C7 | Vector store schema | `11_vector_store_schema.md` | 1,2 |
| C8 | LLM prompts | `12_llm_prompts.md` | 1,2 |
| C9 | LLM observability | `13_llm_observability.md` | 2,3 |

### D. Architecture (SA)

| # | Deliverable | File | Tier |
|---|-------------|------|------|
| D1 | Engine module | `14_engine_module.md` | 1,2,3 |
| D2 | Data flow | `17_data_flow.md` | 1,2 |
| D3 | ERD diagram | `18_erd_diagram.md` | 1,2,3 |
| D4 | OpenAPI spec | `19_openapi_spec.md` | 1,2 |
| D5 | ADR | `20_architecture_decision_record.md` | 1,2 |
| D6 | DBML schema | `21_dbml_schema.md` | 1,2,3 |
| D7 | Migration validate | `24_migration_validate.sql` | 1,2,3 |
| D8 | Seed data | `25_seed_data.sql` | 1,2,3 |

### E. UX/UI (PM)

| # | Deliverable | File | Tier |
|---|-------------|------|------|
| E1 | Wireframes | `27_wireframes.md` | 1,2 |
| E2 | Training video script | `54_training_video_script.md` | 2,3 |
| E3 | SEO optimization | `58_seo_optimization.md` | 4 |
| E4 | Go-to-market | `59_go_to_market.md` | 1,2 |

### F. DevOps / Security (DSL)

| # | Deliverable | File | Tier |
|---|-------------|------|------|
| F1 | API RBAC defense-in-depth | `33_api_rbac_defense_in_depth.md` | 1,2,3 |
| F2 | Pen-test plan | `34_penetration_test_plan.md` | 1,2 |
| F3 | Security plan | `35_security_plan.md` | 1,2 |
| F4 | Secrets management | `36_secrets_management.md` | 2,3 |
| F5 | Deployment runbook | `37_deployment_runbook.md` | 1,2,3 |
| F6 | CI/CD pipeline | `38_ci_cd_pipeline.md` | 2,3 |
| F7 | Monitoring / alerting | `39_monitoring_alerting.md` | 2,3 |
| F8 | Backup / restore / DR | `40_backup_restore_dr.md` | 2,3 |
| F9 | Incident response | `41_incident_response.md` | 2,3 |
| F10 | Helpdesk runbook | `55_helpdesk_runbook.md` | 2,3 |

### G. Compliance / Quality (CQO)

| # | Deliverable | File | Tier |
|---|-------------|------|------|
| G1 | JCI checklist | `42_jci_checklist.md` | 1,2 |
| G2 | ISO 9001 checklist | `43_iso_9001_checklist.md` | 2,3 |
| G3 | PDPL DPIA | `44_pdpl_dpia.md` | 1,2,3 |
| G4 | NPHIES / ZATCA map | `45_nphies_zatca_map.md` | 1,2,3 |
| G5 | Consent forms | `46_consent_forms.md` | 1,2 |
| G6 | Legal contracts | `47_legal_contracts.md` | 3 |
| G7 | Audit trail design | `48_audit_trail_design.md` | 1,2 |

### H. Testing (ORC + SA)

| # | Deliverable | File | Tier |
|---|-------------|------|------|
| H1 | Unit tests | `49_unit_tests.md` | 1,2,3 |
| H2 | Integration tests | `50_integration_tests.md` | 1,2 |
| H3 | E2E tests | `51_e2e_tests.md` | 1,2 |
| H4 | Test plan | `52_test_plan.md` | 1,2 |

### I. Project management (ORC)

| # | Deliverable | File | Tier |
|---|-------------|------|------|
| I1 | Task tracking | `57_task_tracking.md` | all |
| I2 | Budget / token cost | `56_budget_token_cost.md` | all |

## Per-tier minimum

| Tier | Min deliverables | Min files | Min tokens (est) |
|------|------------------|-----------|------------------|
| 1 | 60 (full set) | 60 | 9,000 |
| 2 | 40 | 40 | 6,000 |
| 3 | 25 | 25 | 3,500 |
| 4 | 15 | 15 | 2,000 |

## Verification algorithm

```yaml
verify:
  inputs: [dept_id, tier]
  steps:
    - for each required deliverable for tier:
        check: file_exists(.ai-brain/02_MODULES/<dept_id>/<file>)
        if missing: add to missing[]
    - cross_check:
        - all red_flag rules mentioned in 04_clinical_red_flags have CDS rules in 01
        - all routes in 15_routes_api have auth + tenant + rbac in 16
        - all migrations up have matching down
        - all Stitch layouts referenced in 26 have wireframes in 27
        - all i18n keys in 28 have AR + EN
        - all system prompts in 06 reference snippets
        - all vector indexes in 11 have chunking strategy
        - all RAG chains in 10 cite source docs
        - all OpenAPI paths in 19 match routes in 15
        - all DBML tables in 21 match migration up in 22
    output:
      pass: <bool>
      missing: <list>
      cross_check_failures: <list>
      coverage_pct: <int>
      safety_rails_audit:
        no_secrets: pass|fail
        no_phi_in_seeds: pass|fail
        rls_enforced: pass|fail
        idempotency_on_money: pass|fail
        money_server_side: pass|fail
        audit_hash_chained: pass|fail
        csp_report_only: pass|fail
        tenant_fail_closed: pass|fail
        golden_access: pass|fail
```

## Acceptance criteria per deliverable

Each deliverable must satisfy:
1. **Exists** at the canonical path.
2. **Non-empty** (>50 tokens).
3. **Snippet-referenced** for repeating paragraphs.
4. **Safety-rail compliant** (no secrets, no PHI, RLS on, etc.).
5. **Tier-appropriate depth**.
6. **Cross-referenced** to the master catalog.

## Owner sign-off (L5)

```yaml
owner_signoff:
  name: <owner>
  date: YYYY-MM-DD
  status: APPROVED | APPROVED_WITH_NOTES | REJECTED
  notes: <...>
  signature_line: ___________________
```

## Composability

- `nm-autopilot-dept-generator` — runs this checklist at L5
- `nm-loop-engineering-v2` — uses this checklist as L5 acceptance criteria
- `nm-dept-blueprint-template-v2` — defines the 60 files this checklist verifies
