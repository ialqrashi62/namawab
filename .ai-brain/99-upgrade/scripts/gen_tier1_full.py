#!/usr/bin/env python3
"""
gen_tier1_full.py — fill the remaining 48 placeholder files for each Tier-1 dept.

For each dept folder TIER1_<DEPT_ID>, generates:
05-13: prompt_engineering, system_prompt, context_window,
       workflow_orchestration, langchain_chains, rag_chains,
       vector_store_schema, llm_prompts, llm_observability
15_routes_api
16_middleware_chain
17_data_flow
20_architecture_decision_record (ADR)
21_dbml_schema (alias of 18)
24_migration_validate.sql
26_stitch_layout
27_wireframes
28_i18n_keys
29_design_tokens
30_user_stories
31_acceptance_criteria
32_business_flow
33_api_rbac_defense_in_depth
34_penetration_test_plan
35_security_plan
36_secrets_management
37_deployment_runbook
38_ci_cd_pipeline
39_monitoring_alerting
40_backup_restore_dr
41_incident_response
42_jci_checklist
43_iso_9001_checklist
44_pdpl_dpia
45_nphies_zatca_map
46_consent_forms
47_legal_contracts
48_audit_trail_design
49_unit_tests
50_integration_tests
51_e2e_tests
52_test_plan
53_user_manual
54_training_video_script
55_helpdesk_runbook
56_budget_token_cost
57_task_tracking
58_seo_optimization
59_go_to_market

That's 48 files per dept. With 18 depts = 864 files.
"""

import os, sys, pathlib

ROOT = pathlib.Path(r"C:\Users\ice\Desktop\NMEDCALVSCODE")
AB = ROOT / ".ai-brain"

def eprint(*a, **k):
    print(*a, file=sys.stderr, **k)

def safe(d):
    return d.lower().replace('-','_')

def m(name, dept):
    return name  # placeholder

def emit_prompt_engineering(dept):
    s = safe(dept)
    return f"""# {dept} — Prompt Engineering

## Prompt Registry Entry

```yaml
- id: PROMPT:{dept}:initial_assessment
  version: 1.0.0
  status: draft
  owner: CMO
  dept: {dept}
  languages: [ar, en]
  tier: 1
  safety_class: critical
  requires_red_flag_check: true
  requires_drug_check: true
  requires_citation: true
  input_schema_ref: SCHEMA:{s}_encounter_input
  output_schema_ref: SCHEMA:{s}_assessment_output
  guardrail_set_id: GRD:{dept}:v1
  citations_required: 3
  max_tokens: 1500
  temperature: 0.1
  model_target: gpt-4o
  eval_id: EVAL:{dept}:initial_assessment
  few_shot_count: 5
```

## Guardrails (per GRD:{dept}:v1)

- Pre: phi_redact, tenant_check, specialty_scope
- Post: red_flag, drug_interaction, citation_required, confidence_threshold, pii_audit

## Few-shot examples (5-10)

- top conditions from 03_icd10_snomed_map.md
- each with: patient summary, expected reasoning, citations, expected output ref

## Eval

```
npm run prompt:eval -- --id=PROMPT:{dept}:initial_assessment
```

---

*Owner: AIE+CMO — 2026-08-01*
"""

def emit_system_prompt(dept):
    return f"""# {dept} — System Prompt (compiled base)

```text
You are NamaMedical-AI for {dept} at a Saudi-licensed facility.
Apply CBAHI + NPHIES + SFDA + PDPL.
Operating under absolute rules (cannot override):
1. Red flag -> IMMEDIATELY escalate to {{escalation_contact}}
2. Drug safety: cross-check allergy + meds + pregnancy + renal + SFDA
3. Pediatric: weight-based dosing only
4. PHI never echoed
5. End every clinical recommendation with [CIT:n]
6. Confidence <0.7 => UNCERTAIN + human review

Mandatory structures:
- Differential with top-3 reasoning
- Citations (>=3)
- Confidence numeric 0..1
- Warnings[]
- requires_human_review boolean

JSON output per {{output_schema_ref}}.
```

---

*Owner: CMO+AIE — 2026-08-01*
"""

def emit_context_window(dept):
    return f"""# {dept} — Context Window Shape

```yaml
context_budget:
  default_model: gpt-4o
  budgets:
    gpt-4o: 128000
    claude-3.5: 200000
    med-llama: 8000
allocation_for_{dept.lower()}:
  system_prompt: 800
  patient_mask_summary: 200
  encounter_payload: 1000
  chart_history: 1500
  labs_imaging_recent: 800
  rag_top5: 1500
  few_shot_examples: 800
  citation_context: 500
  total_estimate: ~7100
patient_timeline_api: /api/v1/context/patients/{{id}}/timeline
compaction_strategy: rolling_window_90d
red_flags_on_budget_exceeded: shrink_rag_first
```

---

*Owner: AIE — 2026-08-01*
"""

def emit_workflow_orch(dept):
    return f"""# {dept} — Workflow Orchestration

```yaml
orchestrator: langgraph_supervisor
dept: {dept}
nodes:
  - id: triage
  - id: assessment
  - id: orders
  - id: results_review
  - id: care_plan
  - id: follow_up
edges:
  triage -> assessment (always)
  assessment -> orders (if approved)
  assessment -> care_plan (parallel)
  orders -> results_review
  results_review -> follow_up
hitl_triggers:
  - red_flag_fired
  - drug_alert_block
  - confidence < 0.7
escalation_rules:
  - red_flag -> page_oncall
  - drug_alert -> senior_review
audit:
  hash_chained: true
  retention_years: 7
```

Care pathways (top 5):
- per dept (cite .ai-brain/99-upgrade/16-business/pathways/)

---

*Owner: SA — 2026-08-01*
"""

def emit_langchain(dept):
    return f"""# {dept} — LangChain

```ts
// chains/{safe(dept)}/initial_assessment.ts
import {{ UniversalChain }} from 'src/langchain/UniversalChain';

export class {dept.replace('-','_')}_Initial_Assessment extends UniversalChain<Input, Output> {{
  id = 'CHAIN:{dept}:initial_assessment';
  version = '1.0.0';
  deptId = '{dept}';
  safetyClass = 'critical';

  async prepInput(req) {{ /* see TPL:DEPT/CHAIN */ }}
  async buildLLM(input) {{ return {{prompt_id: 'PROMPT:{dept}:initial_assessment', max_tokens: 1500, temperature: 0.1 }}; }}
  async parseOutput(raw) {{ /* JSON parse + validate */ }}
}}
```

Chains for {dept}:
- CHAIN:{dept}:initial_assessment
- CHAIN:{dept}:risk_stratification
- CHAIN:{dept}:plan_generation

Each chain inherits `preGuardrails` + `postGuardrails` from base.

---

*Owner: AIE — 2026-08-01*
"""

def emit_rag(dept):
    s = safe(dept)
    return f"""# {dept} — RAG Chains

```yaml
chain: RAG:{dept}:initial_assessment
retriever:
  - vector: ai_content_embeddings (pgvector, multilingual-e5-large)
  - bm25: postgres FTS (arabic)
  - kg: terminology_index
corpus_filter:
  - cba
  - nphies
  - sfda
  - journal_{s}
  - local_protocol
top_k: 8
reranker: cross-encoder (ms-marco-MiniLM)
citation_required: 3
patient_graph_used: true
tenant_isolation: enforced
```

## Output

```json
{{
  "answer": "...[CIT:1][CIT:2][CIT:3]",
  "citations": [...],
  "audit_id": "...",
  "token_usage": {{...}}
}}
```

---

*Owner: AIE — 2026-08-01*
"""

def emit_vector(dept):
    return f"""# {dept} — Vector Store Schema

```sql
CREATE TABLE IF NOT EXISTS ai_{safe(dept)}_corpus (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  content TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  embedding VECTOR(1024),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_ai_{safe(dept)}_vec ON ai_{safe(dept)}_corpus USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
ALTER TABLE ai_{safe(dept)}_corpus ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_{safe(dept)}_corpus FORCE ROW LEVEL SECURITY;
-- policy: tenant scoped
```

Loading: nightly from authoritative bundles per dept.

---

*Owner: AIE+SA — 2026-08-01*
"""

def emit_llm_prompts(dept):
    return f"""# {dept} — LLM Prompts (compiled)

```json
{{
  "id": "PROMPT:{dept}:initial_assessment",
  "version": "1.0.0",
  "compiled_from": ".ai-brain/02-prompt-engineering/SYSTEM_PROMPT_BASE.md",
  "vars_used": ["dept_name","facility_type","provider_level","patient_summary_masked","available_calculators"],
  "model_target": "gpt-4o",
  "max_tokens": 1500,
  "temperature": 0.1,
  "hash": "<sha256-of-composed-prompt>"
}}
```

---

*Owner: AIE — 2026-08-01*
"""

def emit_llm_obs(dept):
    return f"""# {dept} — LLM Observability

```yaml
langfuse:
  prompts_to_track:
    - PROMPT:{dept}:initial_assessment
    - PROMPT:{dept}:risk_stratification
  metrics:
    - calls_per_day
    - cost_per_call
    - latency_p95
    - success_rate
    - citation_coverage
    - override_rate
    - red_flag_recall
dashboard: grafana (ai-cost + {dept}-prompt.json)
alert:
  if cost > {{threshold_usd_day}}: slack
  if red_flag_recall < 0.99: page CMO
retention_days: 90
```

---

*Owner: AIE+DSL — 2026-08-01*
"""

def emit_routes(dept):
    s = safe(dept)
    return f"""# {dept} — Routes API

```ts
// namaweb/routes/{s}/index.ts
import {{ Router }} from 'express';
import {{ requireAuth, requireTenantScope, requireRole }} from 'src/middleware';
import {{ validateBody }} from 'src/middleware/validate';
import {{ RS_{s.upper()} }} from 'src/route_schemas';

const r = Router();
r.post('/visits', requireAuth, requireTenantScope, requireRole('doctor'), validateBody(RS_{s.upper()}.createVisit), async (req, res) => {{ /* engine.execute */ }});
r.post('/visits/:visitId/assessment', requireAuth, requireTenantScope, requireRole('doctor'), validateBody(RS_{s.upper()}.assessment), async (req, res) => {{ /* CHAIN:{dept}:initial_assessment */ }});
r.post('/visits/:visitId/orders', requireAuth, requireTenantScope, requireRole('doctor'), validateBody(RS_{s.upper()}.placeOrders), idempotencyGuard, async (req, res) => {{ /* order adapter */ }});
r.get('/tasks/mine', requireAuth, requireTenantScope, async (req, res) => {{ /* tasks/mine */ }});
r.get('/patients/:patientId/results', requireAuth, requireTenantScope, requireRole('doctor','nurse'), async (req, res) => {{ /* */ }});

export default r;
```

Mounted under `/api/v4/{s}` in `server.js`.

---

*Owner: SA — 2026-08-01*
"""

def emit_middleware_chain(dept):
    return f"""# {dept} — Middleware Chain

```text
[REQUEST]
   ↓
helmet + cors allowlist
   ↓
rate_limit (per (tenant, route, role))
   ↓
express-session (Redis+memory fallback)
   ↓
requireAuth (session or Bearer)
   ↓
requireTenantScope (set app.tenant_id via AsyncLocalStorage)
   ↓
requireRole('doctor' | 'nurse' | ...)
   ↓
validateBody(RS_{dept.lower().replace('-','_').upper()}.X)
   ↓
idempotencyGuard (only on money/claim endpoints)
   ↓
[ENGINE EXECUTE]
   ↓
audit.record({{ engine, version, tenant, provider, latency, red_flag_fired, citation_count, confidence }})
   ↓
[response]
```

CSP: report-only by default (rail 8).
No PHI in logs (rail 12).

---

*Owner: SA — 2026-08-01*
"""

def emit_data_flow(dept):
    return f"""# {dept} — Data Flow

```
Client (provider)
   ↓ HTTP
API gateway (CSP/CORS/rate-limit/session)
   ↓
Express route (requireAuth + tenant + role + validateBody)
   ↓
Engine.execute(input, ctx)
   ├─→ PatientRepo.getContext (PG)
   ├─→ GuidelinePort.search (vector + bm25)
   ├─→ RedFlagDetector (server-side)
   ├─→ DrugChecker (server-side, SFDA)
   ├─→ LangChain.build (PROMPT:{dept}:...)
   ├─→ LLM.invoke (gpt-4o or claude-3.5)
   ├─→ parseOutput (JSON schema)
   ├─→ postGuardrails
   └─→ AuditRecord (hash-chained)
   ↓
DB transaction (insert visit + orders + ai_assessment + audit hash)
   ↓
Response (JSON)
```

---

*Owner: SA — 2026-08-01*
"""

def emit_adr(dept):
    return f"""# {dept} — Architecture Decision Record

## ADR-001: Engine as hexagonal base

- **Status:** accepted
- **Date:** 2026-08-01
- **Context:** need consistent pattern for all {dept} engines
- **Decision:** use hexagonal (ports + adapters) with shared Engine base class
- **Consequences:**
  - testability ↑
  - swap infra without changing logic ✓
  - more boilerplate initially (acceptable)

---

*Owner: SA — 2026-08-01*
"""

def emit_dbml(dept):
    return f"""# {dept} — DBML Schema

See `18_erd_diagram.md` for the canonical DBML for {dept}.

```dbml
// Schema split: production tables are in DB; DBML is documentation only.
Project nama_{safe(dept)} {{
  database_type: 'PostgreSQL'
  Note: 'See {dept} 18_erd_diagram.md for full tables.'
}}
```

---

*Owner: SA — 2026-08-01*
"""

def emit_migration_validate(dept):
    s = safe(dept)
    return f"""-- {dept} migration validate
-- Asserts every created table has tenant_id + RLS enabled + policy exists.

DO $$
DECLARE
  v_table text;
  v_missing int := 0;
  v_expected text[] := ARRAY[
    '{s}_visits', '{s}_orders', '{s}_results',
    '{s}_tasks_v2', '{s}_ai_assessments'
  ];
BEGIN
  FOREACH v_table IN ARRAY v_expected LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_tables
      WHERE schemaname='public' AND tablename=v_table
    ) THEN
      RAISE WARNING 'Table % not found', v_table; v_missing := v_missing + 1;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname='public' AND tablename=v_table
    ) THEN
      RAISE WARNING 'No RLS policy on %', v_table; v_missing := v_missing + 1;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE c.relname = v_table AND n.nspname = 'public' AND c.relrowsecurity AND c.relforcerowsecurity
    ) THEN
      RAISE WARNING 'FORCE RLS not enabled on %', v_table; v_missing := v_missing + 1;
    END IF;
  END LOOP;
  IF v_missing > 0 THEN
    RAISE EXCEPTION 'Migration validation failed: % issues', v_missing;
  ELSE
    RAISE NOTICE '{dept} migration validation: PASS';
  END IF;
END $$;
"""

def emit_stitch_layout(dept):
    return f"""# {dept} — Stitch Layout

Layouts A-H (per `nm-stitch-medical-ui/SKILL.md`).

| Screen | Layout | Notes |
|--------|--------|-------|
| Visit summary | A (single column dense) | Header + tabs |
| Order entry | B (split + sticky footer) | Calculator right rail |
| Results review | C (table + facets) | Per test |
| AI co-pilot pane | D (side panel) | DAX-style |

Design tokens: `tokens.css` (no hardcoded colors).
i18n: ar + en; RTL/LTR auto.

---

*Owner: PM — 2026-08-01*
"""

def emit_wireframes(dept):
    return f"""# {dept} — Wireframes (4 key screens)

1. **Encounter summary**
2. **Order entry**
3. **Results review**
4. **AI conversational panel**

Each wireframe references `tokens.css` (per `17-wireframes/DESIGN_TOKENS.yaml`).

Placeholders under `wireframes/{dept}/` for generated HTML.

---

*Owner: PM — 2026-08-01*
"""

def emit_i18n(dept):
    return f"""# {dept} — i18n Keys

```json
{{
  "{dept}": {{
    "title": "{dept}",
    "actions": {{ ... }},
    "fields": {{ ... }}
  }}
}}
```

Path: `.ai-brain/99-upgrade/27-i18n/ar-SA.json` + `en-US.json`
Loading: i18next + react-i18next.

---

*Owner: PM — 2026-08-01*
"""

def emit_design_tokens(dept):
    return f"""# {dept} — Design Tokens (component-level overrides)

Inherits from `17-wireframes/DESIGN_TOKENS.yaml`.
Per-{dept} overrides (if any) documented here.

---

*Owner: PM — 2026-08-01*
"""

def emit_user_stories(dept):
    return f"""# {dept} — User Stories

| ID | Role | Story | AC |
|----|------|-------|----|
| US-{dept}-001 | Doctor | As a doctor, I want AI co-pilot suggestions during assessment | acceptance criteria in 31_acceptance_criteria.md |
| US-{dept}-002 | Nurse | As a nurse, I want my task inbox | ... |

Format: persona + journey + acceptance criteria + Gherkin test.

---

*Owner: PM — 2026-08-01*
"""

def emit_acceptance(dept):
    return f"""# {dept} — Acceptance Criteria

Per user story in 30_user_stories.md.

AC checklist:
- [ ] Functional acceptance
- [ ] Performance (p95)
- [ ] Security (no PHI; CSRF; OWASP)
- [ ] Accessibility (WCAG 2.2 AA)
- [ ] i18n parity
- [ ] Cross-tenant isolation proven

---

*Owner: PM+CQO — 2026-08-01*
"""

def emit_business_flow(dept):
    return f"""# {dept} — Business Flow

End-to-end scenario:

1. Patient check-in
2. Triage + assign
3. Provider visit + AI co-pilot
4. Orders placed
5. Procedure (if any)
6. Results review
7. Care plan emit
8. Follow-up + outcome capture

KPIs: see `outcome-dashboards/{dept}.yaml`.

---

*Owner: PM+CMO — 2026-08-01*
"""

def emit_rbac(dept):
    return f"""# {dept} — API RBAC (defense in depth)

- Layer 1: `requireAuth` rejects if not logged in
- Layer 2: `requireTenantScope` rejects cross-tenant (RLS at row level)
- Layer 3: `requireRole('<role>')` checks user role vs route
- Layer 4: `requireSpecialtyAccess` checks doctor's specialty in scope
- Layer 5: SQL `FORCE ROW LEVEL SECURITY` enforces at DB

Tested in `15-testing/TESTING_QA.md#cross-tenant-tests`.

---

*Owner: SA+DSL — 2026-08-01*
"""

def emit_pentest(dept):
    return f"""# {dept} — Pentest Plan (per route)

- OWASP API Top 10
- BOLA + BFLA on /visits, /orders
- Prompt injection on AI assess
- Cross-tenant on /patients/X
- Idempotency replay on /orders

Schedule: weekly ZAP; quarterly external.

---

*Owner: DSL — 2026-08-01*
"""

def emit_security(dept):
    return f"""# {dept} — Security Plan

Per AGENTS.md safety rails 1-13:
- No hardcoded secrets
- No PHI in commits
- Tenant isolation always on
- Money routes idempotent
- PHI encrypted at rest (DPAPI KEK envelope)
- CSP report-only by default
- Audit log hash-chained

---

*Owner: DSL — 2026-08-01*
"""

def emit_secrets(dept):
    return f"""# {dept} — Secrets Management

Storage: env-vars only (never in tracked code).
Vault or AWS SM recommended for production.
Rotation: quarterly (or on leak).

---

*Owner: DSL — 2026-08-01*
"""

def emit_deploy(dept):
    return f"""# {dept} — Deployment Runbook

1. Lint + typecheck + unit + integration tests pass
2. Migration up applied to staging
3. Feature flag (if applicable) enabled in staging
4. Smoke tests on staging
5. Canary 10% -> 50% -> 100%
6. SLO monitor (rollback if violation)
7. Post-deploy verify (sample visits, sample orders)

---

*Owner: DSL — 2026-08-01*
"""

def emit_cicd(dept):
    return f"""# {dept} — CI/CD Pipeline

```yaml
ci: [lint, typecheck, unit, integration, e2e, security, prompt-eval]
cd:
  staging:  auto-merge from integration/*
  production:  canary + SLO monitor
  rollback:    automatic on SLO breach
  feature_flag: required for new behavior
```

---

*Owner: DSL — 2026-08-01*
"""

def emit_monitoring(dept):
    return f"""# {dept} — Monitoring & Alerting

Metrics:
- API p95 latency per route
- Error rate
- AI cost per call
- Citation coverage
- Red flag rate (should match synthetic)
- Override rate

Alerts: PagerDuty / Opsgenie on SLO breach; LLM cost spike.

---

*Owner: DSL+AIE — 2026-08-01*
"""

def emit_dr(dept):
    return f"""# {dept} — Backup & Restore + DR

RPO < 1 hour, RTO < 4 hours (per 13-infra).
WAL shipping every 5 min + daily snapshot.
30-day rolling + 2y cold.

Drill: quarterly in sandbox.

---

*Owner: DSL — 2026-08-01*
"""

def emit_incident_response(dept):
    return f"""# {dept} — Incident Response

Runbook:
1. Detection (alert)
2. Acknowledge (on-call paged)
3. Triage (severity 1-4)
4. Containment (isolate tenant/feature)
5. Communication (status page)
6. Resolution
7. Post-mortem

Owner: on-call rotation; CMO+DSL for Sev1.

---

*Owner: DSL — 2026-08-01*
"""

def emit_jci(dept):
    return f"""# {dept} — JCI Checklist

Per JCI 7th Ed chapters (relevant for {dept}):
- IPE, ACC, AOP, COP, MMU, QPS, PCI, GLD, FMS

Evidences: located in compliance dashboard.
Surveyors: see `docs/governance/`.

---

*Owner: CQO — 2026-08-01*
"""

def emit_iso(dept):
    return f"""# {dept} — ISO 9001 Checklist

Per ISO 9001:2015 (QMS) clauses:
- 4.1 Context
- 7 Support
- 8 Operation
- 9 Performance evaluation
- 10 Improvement

Mapped to existing SOPs in `namaweb/quality/`.

---

*Owner: CQO — 2026-08-01*
"""

def emit_pdpl(dept):
    return f"""# {dept} — PDPL DPIA

Per PDPL (PD_2019):
- Lawful basis (consent for clinical care)
- Data inventory per activity
- Risk assessment
- Mitigation (encryption + RLS + audit)
- Rights: access, correction, deletion, portability
- Breach notification: within 72h

DPIA template: `namaweb/compliance/pdpl/dpia_template.md`.

---

*Owner: CQO — 2026-08-01*
"""

def emit_nphies_zatca(dept):
    return f"""# {dept} — NPHIES + ZATCA Mapping

NPHIES bundles (per encounter type):
- bundle-patient, bundle-preauth, bundle-claim, ...
- generation: `src/nphies/bundles/{dept.lower()}.js`

ZATCA Phase 2 (UBL XAdES):
- Blocked on real CSID (GATE 9)
- Mock + ready; will flip on real CSID

---

*Owner: CQO+SA — 2026-08-01*
"""

def emit_consent(dept):
    return f"""# {dept} — Consent Forms

Per encounter type (initial, procedure, telehealth, research):
- Digital consent capture (PDPL-compliant)
- Versioned forms (template per dept)
- Audit log per signature
- Withdrawal flow

Storage: `patient_consents` table; RLS + FORCE_RLS.

---

*Owner: CQO — 2026-08-01*
"""

def emit_legal(dept):
    return f"""# {dept} — Legal Contracts

- MSA + DPA per tenant
- BAA (if US)
- Subcontractor agreements
- License terms
- Per-dept specific contracts: research, teaching, transferable care

Owner: Legal + CQO.

---

*Owner: CQO+Legal — 2026-08-01*
"""

def emit_audit_trail(dept):
    return f"""# {dept} — Audit Trail Design

Per safety rail 10: hash-chained, 7+ years.

```sql
CREATE TABLE audit_events_{safe(dept)} (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(64),
  resource_type VARCHAR(64),
  resource_id VARCHAR(64),
  before JSONB, after JSONB,
  ip INET,
  ts TIMESTAMPTZ DEFAULT now(),
  prev_hash VARCHAR(64),
  hash VARCHAR(64) NOT NULL
);
ALTER TABLE audit_events_{safe(dept)} ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events_{safe(dept)} FORCE ROW LEVEL SECURITY;
```

Hash chain: `hash = sha256(prev_hash + ts + user_id + resource + before + after)`

---

*Owner: CQO+DSL — 2026-08-01*
"""

def emit_unit_tests(dept):
    return f"""# {dept} — Unit Tests

```ts
// namaweb/tests/unit/{safe(dept)}/initial_assessment.test.ts
import {{ {dept.replace('-','_')}_Engine }} from '../../../engines/{safe(dept)}/initial_assessment.engine';

describe('{dept} initial assessment engine', () => {{
  it('returns differential with citations', async () => {{ /* ... */ }});
  it('red-flag override is HARD', async () => {{ /* ... */ }});
  it('confidence <0.7 returns UNCERTAIN', async () => {{ /* ... */ }});
  it('citation_required enforces >=3', async () => {{ /* ... */ }});
}});
```

Target: ≥80% coverage per engine.

---

*Owner: SA+AIE — 2026-08-01*
"""

def emit_integration_tests(dept):
    return f"""# {dept} — Integration Tests

```ts
// tests/integration/{safe(dept)}/route.test.ts
import request from 'supertest';
import {{ app }} from '../../../server';

describe('{dept} routes', () => {{
  it('POST /api/v4/{safe(dept)}/visits with valid body returns 201', async () => {{
    const r = await request(app).post('/api/v4/{safe(dept)}/visits')
      .set('Authorization', 'Bearer VALID_JWT')
      .send({{ patient_id: 'P-001', visit_type: 'initial', chief_complaint: 'pain' }});
    expect(r.status).toBe(201);
  }});

  it('cross-tenant returns 403', async () => {{
    // Attempt to access tenant_B resource from tenant_A token
    const r = await request(app).get('/api/v4/{safe(dept)}/patients/OTHER_TENANT_PATIENT')
      .set('Authorization', 'Bearer TENANT_A_JWT');
    expect(r.status).toBe(403);
  }});
}});
```

---

*Owner: SA — 2026-08-01*
"""

def emit_e2e_tests(dept):
    return f"""# {dept} — E2E Tests (Playwright)

```ts
// tests/e2e/{safe(dept)}/happy-path.spec.ts
import {{ test, expect }} from '@playwright/test';

test('{dept}: end-to-end encounter', async ({{ page }}) => {{
  await page.goto('https://staging.jumanasoft.com');
  await page.fill('input[name=email]', 'doctor@test');
  await page.fill('input[name=password]', 'PW');
  await page.click('button:has-text("Login")');
  await page.fill('input[name=mrn]', 'PULM-TEST-001');
  await page.click('button:has-text("Open Chart")');
  await page.click('button:has-text("New Assessment")');
  await expect(page.locator('[data-test=ai-copilot]')).toBeVisible();
  await page.click('button:has-text("Accept")');
  await page.click('button:has-text("Place Orders")');
  await expect(page.locator('[data-test=orders-placed]')).toBeVisible();
}});
```

---

*Owner: SA+QA — 2026-08-01*
"""

def emit_test_plan(dept):
    return f"""# {dept} — Test Plan

| Layer | Tool | Owner | When |
|-------|------|-------|------|
| Unit | jest/vitest | SA | every PR |
| Integration | jest + supertest | SA | every PR |
| Contract | Pact | SA | every PR |
| Clinical safety | custom | AIE+CMO | every PR touching prompt |
| Cross-tenant | custom | DSL | nightly |
| E2E | Playwright | QA | weekly |
| Load | k6 | DSL | monthly |
| Pentest | external | DSL | quarterly |

Definition of Done: 100% safety suite; cross-tenant 0/0 violations.

---

*Owner: SA+CQO — 2026-08-01*
"""

def emit_user_manual(dept):
    return f"""# {dept} — User Manual

AR + EN PDF per role (Doctor, Nurse, Receptionist, Pharmacist, Admin).

Sections:
1. Login + MFA
2. Day-in-the-life
3. {dept}-specific features
4. Common errors
5. FAQ

Hosted: `/docs/manuals/{dept}.pdf` + in-app help.

---

*Owner: PM — 2026-08-01*
"""

def emit_training_script(dept):
    return f"""# {dept} — Training Video Script

10-20 short videos per role:
1. 1-min onboarding
2. 3-min feature deep-dive
3. 5-min scenario (e.g., common workflow)

Storage: Hetzner Storage Box + Cloudflare stream.

Scripts: `training/{dept}/script-NN.md`.

---

*Owner: PM — 2026-08-01*
"""

def emit_helpdesk_runbook(dept):
    return f"""# {dept} — Helpdesk Runbook

Ticket categories:
- How-to
- Bug
- Data correction
- Access request
- Complaint

SLA per priority (see 21-helpdesk).

---

*Owner: PM+DSL — 2026-08-01*
"""

def emit_budget(dept):
    return f"""# {dept} — Budget + Token Cost

```yaml
budget_{dept.lower()}:
  monthly_cap_usd_per_tenant: 500
  per_prompt:
    PROMPT:{dept}:initial_assessment:
      avg_tokens_in: 1200
      avg_tokens_out: 350
      cost_usd: 0.014
  alerts:
    - at_80pct: notify
    - at_95pct: warn
    - at_100pct: degrade non-critical
```

Tracking: `src/cost/recorder.ts` + Grafana dashboard.

---

*Owner: DSL+ORC — 2026-08-01*
"""

def emit_task_tracking(dept):
    return f"""# {dept} — Task Tracking

Local board: `.ai-brain/pm/{dept}.yaml` (auto-generated each sprint).

Status: backlog / planned / in_progress / review / done.
Labels: dept-{dept.lower()}, type-feature, type-bug, severity-*.

---

*Owner: PM — 2026-08-01*
"""

def emit_seo(dept):
    return f"""# {dept} — SEO Optimization

For public marketing page only:
- title + meta description
- og:title, og:image
- structured data (Organization + Service)
- canonical URL

Internal app pages: noindex (per safety rail 9 — no SEO on PHI surfaces).

---

*Owner: PM — 2026-08-01*
"""

def emit_gtm(dept):
    return f"""# {dept} — Go-to-Market

Per dept:
- Buyer persona
- Pain point
- ROI calculation (per bed per dept)
- Reference customers
- Success stories

Used in sales playbook (.ai-brain/22-gtm/).

---

*Owner: PM — 2026-08-01*
"""

# Map files to emitters
EMITTERS = {
    '05_prompt_engineering.md':       emit_prompt_engineering,
    '06_system_prompt.md':            emit_system_prompt,
    '07_context_window.md':           emit_context_window,
    '08_workflow_orchestration.md':   emit_workflow_orch,
    '09_langchain_chains.md':         emit_langchain,
    '10_rag_chains.md':               emit_rag,
    '11_vector_store_schema.md':      emit_vector,
    '12_llm_prompts.md':              emit_llm_prompts,
    '13_llm_observability.md':        emit_llm_obs,
    '15_routes_api.md':               emit_routes,
    '16_middleware_chain.md':         emit_middleware_chain,
    '17_data_flow.md':                emit_data_flow,
    '20_architecture_decision_record.md': emit_adr,
    '21_dbml_schema.md':              emit_dbml,
    '24_migration_validate.sql':      emit_migration_validate,
    '26_stitch_layout.md':            emit_stitch_layout,
    '27_wireframes.md':               emit_wireframes,
    '28_i18n_keys.md':                emit_i18n,
    '29_design_tokens.md':            emit_design_tokens,
    '30_user_stories.md':             emit_user_stories,
    '31_acceptance_criteria.md':      emit_acceptance,
    '32_business_flow.md':            emit_business_flow,
    '33_api_rbac_defense_in_depth.md':emit_rbac,
    '34_penetration_test_plan.md':    emit_pentest,
    '35_security_plan.md':            emit_security,
    '36_secrets_management.md':       emit_secrets,
    '37_deployment_runbook.md':       emit_deploy,
    '38_ci_cd_pipeline.md':           emit_cicd,
    '39_monitoring_alerting.md':      emit_monitoring,
    '40_backup_restore_dr.md':        emit_dr,
    '41_incident_response.md':        emit_incident_response,
    '42_jci_checklist.md':            emit_jci,
    '43_iso_9001_checklist.md':       emit_iso,
    '44_pdpl_dpia.md':                emit_pdpl,
    '45_nphies_zatca_map.md':         emit_nphies_zatca,
    '46_consent_forms.md':            emit_consent,
    '47_legal_contracts.md':          emit_legal,
    '48_audit_trail_design.md':       emit_audit_trail,
    '49_unit_tests.md':               emit_unit_tests,
    '50_integration_tests.md':        emit_integration_tests,
    '51_e2e_tests.md':                emit_e2e_tests,
    '52_test_plan.md':                emit_test_plan,
    '53_user_manual.md':              emit_user_manual,
    '54_training_video_script.md':    emit_training_script,
    '55_helpdesk_runbook.md':         emit_helpdesk_runbook,
    '56_budget_token_cost.md':        emit_budget,
    '57_task_tracking.md':            emit_task_tracking,
    '58_seo_optimization.md':         emit_seo,
    '59_go_to_market.md':             emit_gtm,
}

TIER1 = [
    'GI-001',
    'NEPH-001','ONC-001','ENDO-001','ID-001','DERM-001','RHEUM-001',
    'ER-001','OBG-001','PEDS-001','SURG-001','NEURO-001','ORTHO-001',
    'OPHTH-001','ENT-001','URO-001','ANES-001','ICU-001','PSYC-001'
]  # 19 depts incl. GI-001 (already 12 files; will fill the rest to 60)

def main():
    base = AB / '02_MODULES_NEW'
    written = 0
    for dept_id in TIER1:
        out = base / f"TIER1_{dept_id}"
        if not out.exists():
            eprint(f"  ⚠️ missing {out} -- skipping")
            continue
        for fname, emitter in EMITTERS.items():
            fpath = out / fname
            if fpath.exists():
                continue  # don't overwrite existing detailed files for GI-001
            fpath.write_text(emitter(dept_id), encoding='utf-8')
            written += 1
        eprint(f"  ✅ {dept_id} -> added placeholders")
    eprint(f"\nDone. {written} files written across {len(TIER1)} depts.")
    return 0

if __name__ == '__main__':
    sys.exit(main())
