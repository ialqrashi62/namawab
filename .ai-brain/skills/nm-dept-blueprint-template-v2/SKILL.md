# nm-dept-blueprint-template-v2

> **Type:** template definition
> **Files per dept:** 60
> **Total per tier-1 dept:** ~9,000 output tokens (with S1-S8 token-saver)
> **Owner:** ORC (Master Orchestrator)

---

## Description

The canonical 60-file skeleton for every department blueprint. Tier-1 depts get all 60 files. Tier-2/3/4 follow the selective-depth rule from `nm-token-saver-pack` (S7).

## File map (60 files, numbered 00-59)

| # | Filename | Owner | Snippet | Tier |
|---|----------|-------|---------|------|
| 00 | `00_README.md` | ORC | - | all |
| 01 | `01_clinical_workflows.md` | CMO | - | all |
| 02 | `02_sub_dept_catalog.md` | CMO | - | 1,2 |
| 03 | `03_icd10_snomed_map.md` | CMO+CQO | - | 1,2 |
| 04 | `04_clinical_red_flags.md` | CMO | - | all |
| 05 | `05_prompt_engineering.md` | AIE | - | 1,2 |
| 06 | `06_system_prompt.md` | AIE | - | 1,2 |
| 07 | `07_context_window.md` | AIE | - | 2,3 |
| 08 | `08_workflow_orchestration.md` | AIE | - | 1,2 |
| 09 | `09_langchain_chains.md` | AIE | snippet:langchain-rag | 1,2 |
| 10 | `10_rag_chains.md` | AIE | snippet:langchain-rag | 1,2 |
| 11 | `11_vector_store_schema.md` | AIE | snippet:vector-mine | 1,2 |
| 12 | `12_llm_prompts.md` | AIE | - | 1,2 |
| 13 | `13_llm_observability.md` | AIE | - | 2,3 |
| 14 | `14_engine_module.md` | SA | - | 1,2,3 |
| 15 | `15_routes_api.md` | SA | - | all |
| 16 | `16_middleware_chain.md` | SA | snippet:safety-gate | all |
| 17 | `17_data_flow.md` | SA | - | 1,2 |
| 18 | `18_erd_diagram.md` | SA | - | 1,2,3 |
| 19 | `19_openapi_spec.md` | SA | snippet:openapi-3-1 | 1,2 |
| 20 | `20_architecture_decision_record.md` | SA | snippet:adr-header | 1,2 |
| 21 | `21_dbml_schema.md` | SA | snippet:dbml-header | 1,2,3 |
| 22 | `22_migration_up.sql` | SA | snippet:rls-default | 1,2,3 |
| 23 | `23_migration_down.sql` | SA | snippet:rls-default | 1,2,3 |
| 24 | `24_migration_validate.sql` | SA | - | 1,2,3 |
| 25 | `25_seed_data.sql` | SA+CQO | - | 1,2,3 |
| 26 | `26_stitch_layout.md` | PM/UX | snippet:stitch-medical | all |
| 27 | `27_wireframes.md` | PM/UX | template:wireframe_v1 | 1,2 |
| 28 | `28_i18n_keys.md` | PM/UX | - | all |
| 29 | `29_design_tokens.md` | PM/UX | snippet:stitch-medical | all |
| 30 | `30_user_stories.md` | PM/UX | template:user_story | 1,2,3 |
| 31 | `31_acceptance_criteria.md` | PM/UX | - | 1,2,3 |
| 32 | `32_business_flow.md` | PM/UX | - | 1,2 |
| 33 | `33_api_rbac_defense_in_depth.md` | DSL | - | 1,2,3 |
| 34 | `34_penetration_test_plan.md` | DSL | - | 1,2 |
| 35 | `35_security_plan.md` | DSL | snippet:phi-vault + snippet:golden-access | 1,2 |
| 36 | `36_secrets_management.md` | DSL | - | 2,3 |
| 37 | `37_deployment_runbook.md` | DSL | - | 1,2,3 |
| 38 | `38_ci_cd_pipeline.md` | DSL | - | 2,3 |
| 39 | `39_monitoring_alerting.md` | DSL | - | 2,3 |
| 40 | `40_backup_restore_dr.md` | DSL | - | 2,3 |
| 41 | `41_incident_response.md` | DSL | - | 2,3 |
| 42 | `42_jci_checklist.md` | CQO | - | 1,2 |
| 43 | `43_iso_9001_checklist.md` | CQO | - | 2,3 |
| 44 | `44_pdpl_dpia.md` | CQO | - | 1,2,3 |
| 45 | `45_nphies_zatca_map.md` | CQO | - | 1,2,3 |
| 46 | `46_consent_forms.md` | CQO | - | 1,2 |
| 47 | `47_legal_contracts.md` | CQO | - | 3 |
| 48 | `48_audit_trail_design.md` | CQO+DSL | snippet:audit-hash | 1,2 |
| 49 | `49_unit_tests.md` | ORC+SA | snippet:test-pattern | 1,2,3 |
| 50 | `50_integration_tests.md` | ORC+SA | snippet:test-pattern | 1,2 |
| 51 | `51_e2e_tests.md` | ORC+SA | snippet:test-pattern | 1,2 |
| 52 | `52_test_plan.md` | ORC | - | 1,2 |
| 53 | `53_user_manual.md` | PM/UX | - | 1,2 |
| 54 | `54_training_video_script.md` | PM/UX | - | 2,3 |
| 55 | `55_helpdesk_runbook.md` | DSL+PM | - | 2,3 |
| 56 | `56_budget_token_cost.md` | ORC | - | all |
| 57 | `57_task_tracking.md` | ORC | - | all |
| 58 | `58_seo_optimization.md` | PM/UX | - | 4 |
| 59 | `59_go_to_market.md` | PM/UX+CQO | - | 1,2 |
| 60 | `_closeout.md` | ORC | template:closeout | all |

## Per-tier file count

| Tier | Files written | Token est |
|------|---------------|-----------|
| 1 | 60 | ~9,000 |
| 2 | 40 (drop 11, 13, 36, 38, 39, 40, 41, 43, 47, 54, 55, 57, 58, 60 closeout stays) | ~6,000 |
| 3 | 25 (drop most) | ~3,500 |
| 4 | 15 (essentials only) | ~2,000 |

## File-level template examples

### `00_README.md` (200 tokens)

```markdown
# <DEPT NAME> — <ID>

> <one-line purpose>
> Tier: 1|2|3|4 · Group: <group> · Owner: <expert>
> Last updated: YYYY-MM-DD

## 60-file index
[link to each file 00-59]

## Quick links
- Catalog: MASTER_CATALOG_v3.yaml#<id>
- Stitch: https://stitch.withgoogle.com/projects/17612445146025313712 (search "<name>")
- Live: /namaweb/public/js/<station>.js (if exists)

## Compliance
[JCI | CBAHI | NPHIES | ZATCA | SFDA | PDPL]

## Red flags
<list 3-5>

## Safety rails
[snippet:golden-access, snippet:phi-vault, snippet:rls-default]
```

### `01_clinical_workflows.md` (400 tokens)

```yaml
workflows:
  - id: wf-1
    name_ar: <...>
    name_en: <...>
    trigger: <symptom|lab|result|order|event>
    actors: [doctor, nurse, patient, technician]
    steps:
      - { seq: 1, actor: <...>, action: <...>, system: <api>, red_flag: false }
      - { seq: 2, actor: <...>, action: <...>, system: <api>, red_flag: false }
    red_flags_inline: [<list>]
    duration_est_min: <int>
    cds_rules: [<id>]
    snomed_codes: [<list>]
    icd10_codes: [<list>]
```

### `04_clinical_red_flags.md` (300 tokens)

```yaml
red_flags:
  - id: rf-1
    name_ar: <...>
    name_en: <...>
    criteria: <2-3 line>
    immediate_action: <2-3 line>
    notify: [role1, role2]
    sla_min: <int>
    snomed: <code>
    icd10: <code>
```

### `09_langchain_chains.md` (200 tokens)

```yaml
chains:
  - id: <chain_name>
    purpose: <1 line>
    inputs: [<variable or table ref>]
    outputs: [<variable or table ref>]
    steps:
      - { type: retriever, index: <vector_mine_id>, top_k: 5 }
      - { type: reranker, model: <...> }
      - { type: llm, model: <gpt-4|claude-3.5|...>, system: <...> }
      - { type: parser, schema: <zod|json|pydantic> }
    observability: <langfuse|tracing>
    cost_per_call_usd: <est>
```

### `11_vector_store_schema.md` (200 tokens)

```yaml
vector_mine:
  index_id: <e.g. nm_cardio_v1>
  embedding:
    model: text-embedding-3-small | bge-m3 | multilingual-e5
    dims: 1536 | 1024 | 768
  chunking:
    size: 512
    overlap: 64
  refresh: nightly | on-write
  sources:
    - { name: <table or doc>, filter: tenant_id = current, pii: redact }
  retention: 7y
  namespace: tenant_<tenant_id>
```

### `15_routes_api.md` (300 tokens)

```yaml
routes:
  - method: GET
    path: /api/<area>/<resource>
    auth: [requireAuth, requireTenantScope, requireRole('<area>')]
    validation: <zod schema or RS.id>
    response: <json shape>
    cache: <key + ttl>
    idempotent: true
  - method: POST
    path: /api/<area>/<resource>
    auth: [requireAuth, requireTenantScope, requireRole('<area>'), validateBody, idempotencyGuard]
    body_schema: <zod>
    response: <json shape>
```

### `16_middleware_chain.md` (150 tokens)

```yaml
middleware_chain:
  global: [helmet, cors_allowlist, csp_report_only, rate_limit, session, request_id, audit_middleware(opt-in)]
  protected:
    - [requireAuth, requireTenantScope, requireRole, validateBody, idempotencyGuard(if money)]
  money_only:
    - idempotency: <key derived from idem_key>
  fail_closed_on_missing_tenant: true
```

### `18_erd_diagram.md` (200 tokens)

```mermaid
erDiagram
  PATIENTS ||--o{ ENCOUNTERS : has
  ENCOUNTERS ||--o{ ORDERS : places
  ORDERS ||--o{ RESULTS : produces
  PATIENTS ||--o{ ALLERGIES : has
  ...
```

### `19_openapi_spec.md` (400 tokens)

```yaml
openapi: 3.1.0
info:
  title: <dept> API
  version: 1.0.0
  description: |
    <2-3 line>
servers:
  - url: https://jumanasoft.com
security:
  - bearerAuth: []
paths:
  /api/<area>/<resource>:
    get: ...
    post: ...
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### `22_migration_up.sql` (300 tokens)

```sql
-- 22_migration_up.sql
-- <DEPT> table set v1
-- Tenant isolation: tenant_id NOT NULL + RLS enabled
BEGIN;

CREATE TABLE IF NOT EXISTS <table> (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id     UUID NOT NULL REFERENCES tenants(id) ON DELETE RESTRICT,
  ...
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by    UUID REFERENCES users(id),
  updated_by    UUID REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS <idx> ON <table> (tenant_id, <col>);
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
ALTER TABLE <table> FORCE ROW LEVEL SECURITY;
CREATE POLICY <table>_tenant_isolation ON <table>
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

COMMIT;
```

### `33_api_rbac_defense_in_depth.md` (200 tokens)

```yaml
defense_in_depth:
  layers:
    - { layer: network, control: <cors_allowlist, csp> }
    - { layer: transport, control: <https, hsts> }
    - { layer: session, control: <secure, httpOnly, sameSite=Lax, mfa> }
    - { layer: authz, control: <requireRole + golden_access> }
    - { layer: validation, control: <zod fail-closed> }
    - { layer: tenant, control: <requireTenantScope + rls> }
    - { layer: data, control: <crypto_envelope + audit_hash> }
    - { layer: money, control: <server_side + idempotency> }
  matrix: <role × resource × action>
  audit: <hash_chained>
```

### `35_security_plan.md` (300 tokens)

```yaml
security_plan:
  threats:
    - { id: T1, threat: <SQLi>, likelihood: low, impact: high, mitigation: <parameterized + ORM> }
  controls:
    - { id: C1, name: <RLS>, status: enforced }
    - { id: C2, name: <PHI vault>, status: enforced }
    - { id: C3, name: <audit log>, status: opt-in }
  secrets: <vault|env|.env>
  pen_test: <yearly + scope>
  incident_response: <runbook ref>
  rto_min: <int>
  rpo_min: <int>
```

### `49_unit_tests.md` (300 tokens)

```yaml
unit_tests:
  framework: node:test | jest
  coverage_target_pct: 80
  tests:
    - { id: ut-1, name: <...>, target: <fn>, asserts: <int> }
    - { id: ut-2, name: <...>, target: <fn>, asserts: <int> }
  red_flag_tests: true
  cross_tenant_tests: true
```

### `60_closeout.md` (200 tokens)

```yaml
closeout:
  date: YYYY-MM-DD
  status: COMPLETED | BLOCKED | DEFERRED
  scope_delivered: [file list with line counts]
  scope_not_delivered: [list]
  safety_rails:
    applied: [1,2,3,5,9,11,12,13]
    exceptions: []
  compliance: { jci, cbahi, nphies, zatca, pdpl, sfda }
  performance: pass|fail
  security: pass|fail
  test_pct: <int>
  owner_signoff_required: true
  next_phase: <name>
```

## Cross-cutting snippet reuse

When generating any file in the 60-file set:
- **`snippet:rls-default`** — for any `.sql` migration touching tenant-scoped tables.
- **`snippet:phi-vault`** — for any file mentioning PHI encryption.
- **`snippet:golden-access`** — for any file mentioning access control.
- **`snippet:safety-gate`** — for any file mentioning middleware chain.
- **`snippet:audit-hash`** — for any file mentioning audit trail.
- **`snippet:money-vat`** — for any file mentioning money/VAT.
- **`snippet:csp-report-only`** — for any UI file mentioning CSP.
- **`snippet:auth-mfa`** — for any file mentioning authentication.
- **`snippet:idempotency`** — for any file mentioning money routes.
- **`snippet:ar-rtl`** — for any UI/i18n file.
- **`snippet:stitch-medical`** — for any UI file.
- **`snippet:langchain-rag`** — for any AI file.
- **`snippet:vector-mine`** — for any vector index file.
- **`snippet:openapi-3-1`** — for `19_openapi_spec.md`.
- **`snippet:dbml-header`** — for `21_dbml_schema.md`.
- **`snippet:adr-header`** — for `20_architecture_decision_record.md`.
- **`snippet:test-pattern`** — for `49-51` test files.

These snippets are the only acceptable way to write repeated paragraphs. Reuse, don't rewrite.
