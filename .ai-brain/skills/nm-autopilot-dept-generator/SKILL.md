# nm-autopilot-dept-generator v2

> **Type:** batch runner
> **Inputs:** MASTER_CATALOG_v3 + dept-blueprint-template-v2
> **Output:** per-department 60-file blueprint at predictable token cost
> **Modes:** dry-run | plan | plan+ui | plan+ui+backend (last requires owner approval)

---

## Description

Runs the 7-Expert Panel + 5-Loop Engineering on **many departments in batch** with deterministic, repeatable output. Batches are tiered:

- **Tier-1 batch:** 10-20 depts (high-traffic, revenue-critical)
- **Tier-2 batch:** 20-40 depts (specialties + diagnostics)
- **Tier-3 batch:** 20-40 depts (support, admin, academic)
- **Tier-4 batch:** rare + CoE composites

## When to use

- "Generate AI brain for the missing departments"
- "Complete department docs for [group]"
- "Onboard all 100+ departments to the new 60-file template"
- "Refresh stale department docs"

## Pre-flight checklist (before batch start)

- [ ] `.ai-brain/00_SYSTEM/MASTER_CATALOG_v3.yaml` exists and is the latest.
- [ ] `.ai-brain/skills/shared/snippets.md` exists with all 8+ snippets.
- [ ] `.ai-brain/skills/nm-7-expert-panel-orchestrator/SKILL.md` loaded.
- [ ] `.ai-brain/skills/nm-loop-engineering-v2/SKILL.md` loaded.
- [ ] `.ai-brain/skills/nm-token-saver-pack/SKILL.md` loaded.
- [ ] `.ai-brain/skills/nm-dept-blueprint-template-v2/SKILL.md` loaded.
- [ ] `.ai-brain/skills/nm-stitch-medical-ui/SKILL.md` loaded.
- [ ] `.ai-brain/skills/nm-comprehensive-deliverables-checklist/SKILL.md` loaded.
- [ ] `.ai-brain/skills/nm-rag-vector-mine/SKILL.md` loaded.
- [ ] `.ai-brain/INDEX.md` exists.
- [ ] `.ai-brain/99-state/current-phase.json` initialized.

## Batch runner algorithm

```
for batch in [tier-1, tier-2, tier-3, tier-4]:
  for dept in batch:
    1. L1 DISCOVER (read MASTER_CATALOG_v3 entry for dept)
    2. L2 PLAN (pick approach, list files, risk register)
    3. L3 BUILD (60 files per template)
    4. L4 TEST (smoke + cross-tenant + security)
    5. L5 VERIFY (closeout)
    6. UPDATE INDEX.md + DEPARTMENT_COVERAGE_MAP.md
    7. ESCALATE if any loop exceeds 4 iterations
```

## Per-department pipeline

For each dept, the runner produces exactly **60 files** following the dept-blueprint-template-v2.

| # | File | Owner expert | Token est |
|---|------|--------------|-----------|
| 1 | `00_README.md` | ORC | 200 |
| 2 | `01_clinical_workflows.md` | CMO | 400 |
| 3 | `02_sub_dept_catalog.md` | CMO | 200 |
| 4 | `03_icd10_snomed_map.md` | CMO+CQO | 200 |
| 5 | `04_clinical_red_flags.md` | CMO | 300 |
| 6 | `05_prompt_engineering.md` | AIE | 200 |
| 7 | `06_system_prompt.md` | AIE | 200 |
| 8 | `07_context_window.md` | AIE | 150 |
| 9 | `08_workflow_orchestration.md` | AIE | 200 |
| 10 | `09_langchain_chains.md` | AIE | 200 |
| 11 | `10_rag_chains.md` | AIE | 200 |
| 12 | `11_vector_store_schema.md` | AIE | 200 |
| 13 | `12_llm_prompts.md` | AIE | 200 |
| 14 | `13_llm_observability.md` | AIE | 150 |
| 15 | `14_engine_module.md` | SA | 200 |
| 16 | `15_routes_api.md` | SA | 300 |
| 17 | `16_middleware_chain.md` | SA | 150 |
| 18 | `17_data_flow.md` | SA | 200 |
| 19 | `18_erd_diagram.md` | SA | 200 |
| 20 | `19_openapi_spec.md` | SA | 400 |
| 21 | `20_architecture_decision_record.md` | SA | 200 |
| 22 | `21_dbml_schema.md` | SA | 300 |
| 23 | `22_migration_up.sql` | SA | 300 |
| 24 | `23_migration_down.sql` | SA | 200 |
| 25 | `24_migration_validate.sql` | SA | 150 |
| 26 | `25_seed_data.sql` | SA+CQO | 200 |
| 27 | `26_stitch_layout.md` | PM/UX | 200 |
| 28 | `27_wireframes.md` | PM/UX | 300 |
| 29 | `28_i18n_keys.md` | PM/UX | 150 |
| 30 | `29_design_tokens.md` | PM/UX | 150 |
| 31 | `30_user_stories.md` | PM/UX | 200 |
| 32 | `31_acceptance_criteria.md` | PM/UX | 150 |
| 33 | `32_business_flow.md` | PM/UX | 300 |
| 34 | `33_api_rbac_defense_in_depth.md` | DSL | 200 |
| 35 | `34_penetration_test_plan.md` | DSL | 200 |
| 36 | `35_security_plan.md` | DSL | 300 |
| 37 | `36_secrets_management.md` | DSL | 150 |
| 38 | `37_deployment_runbook.md` | DSL | 300 |
| 39 | `38_ci_cd_pipeline.md` | DSL | 200 |
| 40 | `39_monitoring_alerting.md` | DSL | 200 |
| 41 | `40_backup_restore_dr.md` | DSL | 200 |
| 42 | `41_incident_response.md` | DSL | 200 |
| 43 | `42_jci_checklist.md` | CQO | 300 |
| 44 | `43_iso_9001_checklist.md` | CQO | 200 |
| 45 | `44_pdpl_dpia.md` | CQO | 200 |
| 46 | `45_nphies_zatca_map.md` | CQO | 200 |
| 47 | `46_consent_forms.md` | CQO | 200 |
| 48 | `47_legal_contracts.md` | CQO | 200 |
| 49 | `48_audit_trail_design.md` | CQO+DSL | 200 |
| 50 | `49_unit_tests.md` | ORC+SA | 300 |
| 51 | `50_integration_tests.md` | ORC+SA | 300 |
| 52 | `51_e2e_tests.md` | ORC+SA | 300 |
| 53 | `52_test_plan.md` | ORC | 200 |
| 54 | `53_user_manual.md` | PM/UX | 300 |
| 55 | `54_training_video_script.md` | PM/UX | 200 |
| 56 | `55_helpdesk_runbook.md` | DSL+PM | 200 |
| 57 | `56_budget_token_cost.md` | ORC | 150 |
| 58 | `57_task_tracking.md` | ORC | 150 |
| 59 | `58_seo_optimization.md` | PM/UX | 150 |
| 60 | `59_go_to_market.md` | PM/UX+CQO | 200 |

**Total per-department budget:** ~14,000 output tokens (with snippet reuse reduces to ~9,000).

## Per-tier strategy

| Tier | Departments | Token est per batch | Wall time (parallel) |
|------|-------------|---------------------|----------------------|
| Tier-1 | 20 × 60 files = 1,200 files | ~180,000 | 1-2 sessions |
| Tier-2 | 40 × 60 files = 2,400 files | ~360,000 | 2-3 sessions |
| Tier-3 | 40 × 60 files = 2,400 files | ~360,000 | 2-3 sessions |
| Tier-4 | 20 × 60 files = 1,200 files | ~180,000 | 1-2 sessions |

## Execution modes

### Mode 1 — dry-run
Only L1+L2 (DISCOVER+PLAN). No files written. Output: `plan.md` per dept.

### Mode 2 — plan
L1+L2+L3 (no test). Output: 60 files per dept. ~9K tokens per dept.

### Mode 3 — plan+ui
L1+L2+L3 with Stitch artifacts emphasized. Output: 60 files with extra wireframe depth.

### Mode 4 — plan+ui+backend
L1+L2+L3+L4+L5. Includes test files, code-level stubs for `engine_module`, `routes_api`, `middleware_chain`. **Requires explicit owner approval** before running.

## Halt and escalate triggers

- A loop exceeds 4 iterations → escalate to owner.
- A safety rail violation detected → halt batch, log, escalate.
- Token budget exceeded for a dept by > 50% → halt, reduce scope, re-plan.
- Cross-tenant test failure on a Tier-1 dept → halt batch, fix, resume.
- Compliance (JCI/CBAHI) fail on red-flag dept (e.g. ER, ICU, OBG) → halt.

## State management

After each batch:
1. Update `.ai-brain/INDEX.md` with new depts.
2. Update `.ai-brain/DEPARTMENT_COVERAGE_MAP.md` (group × tier matrix).
3. Update `.ai-brain/99-state/current-phase.json` with batch status.
4. Append to `.ai-brain/AI_PROJECT_MEMORY.md` the phase log.
5. Commit (or leave for owner) with conventional message: `docs(ai-brain): tier-N batch-N <group> complete`.

## Composability

Combine with:
- `nm-7-expert-panel-orchestrator` — drives the per-dept panel
- `nm-loop-engineering-v2` — drives the 5 loops per dept
- `nm-token-saver-pack` — keeps per-dept output under budget
- `nm-dept-blueprint-template-v2` — defines the 60 files
- `nm-stitch-medical-ui` — produces Stitch layout for files 26-32
- `nm-rag-vector-mine` — produces VectorMine for files 10-13
- `nm-comprehensive-deliverables-checklist` — verifies all 60 files exist
