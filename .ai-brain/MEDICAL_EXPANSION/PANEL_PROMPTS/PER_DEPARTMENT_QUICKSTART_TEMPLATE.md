# Per-Department Quick-Start Template (7-Expert Panel Output)

> **Use this template** for every department / sub-unit spec.
> **Owner:** Master Orchestrator (synthesizes 6 expert inputs).
> **Output location:** `.ai-brain/<GROUP>/<DEPT>/<FILE>.md`

---

## FRONT MATTER (every file)

```markdown
# <Title>

> **Dept:** <name> | **Group:** <group> | **Cluster DBML:** <path>
> **Status:** A (existing) | B (partial) | C (greenfield)
> **Date:** 2026-07-22 | **Version:** 1.0
> **Owners:** CMO, AI Engineer, Architect, DevOps, PM/UX, Compliance
```

---

## 1. `00_prompt_engineering.md` (AI Engineer)

```markdown
# Prompt Engineering — <DEPT>

## Input
- Patient context: <JSON schema>
- Clinical note: <free text>
- Question: <free text>

## Output (structured)
- ICD-10-AM codes: [...]
- Recommendations: [{action, evidence, urgency}]
- Citations: [{source, chunk_id, score}]
- Confidence: [0-1]

## Guardrails
- No diagnosis without clinician confirmation.
- Always cite a guideline chunk.
- Reject if input contains unredacted PHI markers.
```

## 2. `00b_system_prompt.md` (AI Engineer)

```markdown
# System Prompt — <DEPT>

You are a clinical decision support assistant for the <DEPT> department of
NamaMedical Hospital. You operate under CBAHI Standard APR.<N> and JCI
International Patient Safety Goal <X>. You never make a final diagnosis; you
surface evidence-based suggestions that a qualified physician must confirm.

When responding, ALWAYS:
1. Cite a guideline (chunk_id, source, score).
2. Use ICD-10-AM codes from the active catalog.
3. Flag drug-allergy and drug-drug interactions.
4. Escalate to attending if red-flag detected (<list>).
5. Refuse to answer if the question is outside <DEPT> scope; route to the
   appropriate department.
```

## 3. `00c_context.md` (CMO + AI)

```markdown
# Clinical Context — <DEPT>

## Patient (input)
{
  "patient_id": "...",
  "age_years": ...,
  "sex": "...",
  "weight_kg": ...,
  "allergies": [...],
  "active_meds": [...],
  "active_problems": [...],
  "vitals": {...},
  "lab_results_recent": [...],
  "imaging_recent": [...],
  "consent_flags": {...}
}

## Encounter (input)
{
  "encounter_id": "...",
  "specialty": "<DEPT>",
  "triage_level": ...,
  "presenting_complaint": "...",
  "duration_hours": ...,
  "relevant_history": "..."
}

## Retrieved Knowledge (input)
{
  "chunks": [{ "id", "text", "source", "score" }],
  "guidelines_active": [...],
  "form_template_id": ...
}
```

## 4. `01_clinical_spec.md` (CMO + PM)

```markdown
# <DEPT> — Clinical Spec

## 1. Clinical Scope
- Mission: ...
- Patient population: ...
- Top 5 conditions (ICD-10-AM):
  1. ...
  2. ...
- Care bundles: ...
- Hand-offs: SBAR template
- Escalation thresholds (EWS, MEWS, qSOFA): ...

## 2. Clinical Workflow
1. Triage
2. Initial assessment
3. Investigations
4. Diagnosis
5. Treatment plan
6. Monitoring
7. Discharge / Hand-off

## 3. Data Model
- Tables: <list with RLS policy>
- Indexes: <list>
- Triggers: <list>

## 4. API Surface
- REST endpoints: <list with RBAC + idempotency>
- WebSocket events: <list if any>

## 5. AI / RAG Hooks
- Knowledge base: <chunk count, source>
- Retrieval top-k: 5
- Prompt template: see 00b
- Guardrails: see 00

## 6. UI / Stitch
- 3-col layout
- RTL/LTR: AR right, EN left
- Accessibility: WCAG 2.2 AA
- Stitch reference: <attached>

## 7. Compliance
- CBAHI: <standard>
- JCI: <standard>
- PDPL: <consent>
- Retention: <years>

## 8. KPIs
- <5 measurable KPIs>

## 9. Test Plan
- Unit: ...
- Integration: ...
- E2E: ...

## 10. Deployment
- Migration: <order>
- Feature flag: <if any>
- Rollback: <one-liner>

## 11. Open Questions
- ...
```

## 5. `01b_user_stories.md` (PM)

```markdown
# User Stories — <DEPT>

## US-1: <title>
**As a** <role>
**I want to** <action>
**So that** <benefit>

### Acceptance Criteria (Gherkin)
```gherkin
Given <precondition>
When <action>
Then <expected outcome>
```

## US-2: ...
```

## 6. `02_ai_orchestration.md` (AI Engineer)

```markdown
# AI Orchestration — <DEPT>

## LangChain Chain
```
[PatientContext] -> [Retriever] -> [PromptTemplate] -> [LLM (gpt-4o-mini)] -> [OutputParser] -> [Validator] -> [Audit]
```

## RAG Strategy
- Embedding model: text-embedding-3-small (1536-dim)
- Chunk size: 512 tokens, overlap 50
- Top-k: 5
- Re-rank: cross-encoder/ms-marco-MiniLM

## Vector Database
- Storage: pgvector (production) or REAL[] (dev fallback)
- Table: clinical_knowledge_vectors
- Tenant isolation: by `tenant_id`
- Update schedule: weekly re-embed of new guidelines

## Prompt Template
```
{system_prompt}

Patient: {patient_context}
Recent vitals: {vitals}
Question: {question}

Relevant guidelines:
{retrieved_chunks}

Answer in this JSON shape:
{output_schema}
```

## Observability
- LangFuse trace ID: ...
- Latency target: <2s p95
- Cost target: <$0.01 per query
```

## 7. `02b_vector_database.md` (AI Engineer)

```markdown
# Vector Database — <DEPT>

## Table Schema
```sql
CREATE TABLE clinical_knowledge_vectors (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  cluster VARCHAR(64) NOT NULL,  -- e.g. 'cardiology'
  sub_unit VARCHAR(64),          -- e.g. 'interventional'
  chunk_id VARCHAR(64) NOT NULL,
  source VARCHAR(256) NOT NULL,
  text TEXT NOT NULL,
  embedding REAL[] NOT NULL,     -- 1536-dim
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE clinical_knowledge_vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_knowledge_vectors FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON clinical_knowledge_vectors
  USING (tenant_id = current_setting('app.tenant_id')::BIGINT);
```

## Index
- ivfflat (embedding vector_cosine_ops) with lists=100

## Fallback (no pgvector)
- Compute cosine similarity in app code: `1 - dot(a,b) / (norm(a)*norm(b))`
```

## 8. `02c_llm_observability.md` (AI Engineer)

```markdown
# LLM Observability — <DEPT>

## Tool: LangFuse (self-hosted) or LangSmith (cloud)

## Tracked Metrics
- Request count
- Latency p50/p95/p99
- Token usage (input + output)
- Cost (USD)
- Error rate
- Hallucination rate (eval set)

## Eval Set
- 50 golden Q&A per dept
- Run on every prompt-template change (CI gate)
- Pass threshold: 90% accuracy

## Alerts
- Cost > $X/day → Slack alert
- Latency p95 > 3s → PagerDuty
- Error rate > 5% → PagerDuty
```

## 9. `03_technical_arch.md` (Architect)

```markdown
# Technical Architecture — <DEPT>

## Backend
- New routes: <list in server.js or new router>
- New tables: <list with RLS>
- New engines: <list>

## Frontend
- New station: <name>
- 3-col Stitch layout
- Routes: NAV indices <X-Y>
- i18n keys: <count>

## Dependencies
- New npm: <list with versions>
- New env: <list>

## Observability
- New APM spans: <list>
- New audit events: <list>
```

## 10. `03b_erd.md` (Architect)

DBML fragment (append to cluster).

## 11. `03c_auth.md` (Architect)

```markdown
# Auth — <DEPT>

## Routes require
- requireAuth: yes
- requireTenantScope: yes
- requireRole: <roles>

## SSO
- Provider: SAML 2.0 (Keycloak) or OIDC
- Roles mapped: <mapping>

## JWT
- TTL: 8h
- Refresh: yes
- Rotation: daily
```

## 12. `03d_rbac.md` (Architect)

```markdown
# RBAC Matrix — <DEPT>

| Action | Admin | Doctor | Nurse | Patient | Other |
|---|---|---|---|---|---|
| View own record | ✅ | ✅ | ✅ | ✅ | ❌ |
| Edit own record | ❌ | ❌ | ❌ | ❌ | ❌ |
| View dept records | ✅ | ✅ (own dept) | ✅ (own dept) | ❌ | ❌ |
| Sign note | ❌ | ✅ | ❌ | ❌ | ❌ |
| ... |
```

## 13. `04_ux_ui_stitch.md` (PM/UX)

```markdown
# UX / UI / Stitch — <DEPT>

## 3-Col Layout

### Left (Navigation / Context)
- <list of widgets>

### Center (Main workspace)
- <list of widgets>

### Right (Side panel: notes, orders, results, vitals)
- <list of widgets>

## Stitch HTML Reference
<attached file or inline HTML>

## Style Tokens
- Primary: <hex>
- Background: <hex>
- Font: <stitch font>
- Spacing: 8px grid

## AR/EN Labels
- See 04c_i18n.json

## Accessibility
- WCAG 2.2 AA
- Keyboard nav: all interactive
- Screen reader: ARIA labels
- Color contrast: 4.5:1 minimum

## RTL/LTR
- AR: right-to-left, layout mirrors
- EN: left-to-right
```

## 14. `04b_assets.md` (PM/UX)

```markdown
# Digital Assets — <DEPT>

## Icons
- Header: <SVG path>
- <action>: <SVG path>

## Fonts
- Primary: IBM Plex Sans Arabic (AR), Inter (EN)
- Mono: IBM Plex Mono

## Illustrations
- Empty state: <SVG>
- Loading: <animation>
```

## 15. `04c_i18n.json` (PM/UX)

```json
{
  "<dept>.title": {"ar": "...", "en": "..."},
  "<dept>.subtitle": {"ar": "...", "en": "..."}
}
```

## 16. `04d_seo.md` (PM)

For public-facing pages (e.g., department landing on `jumanasoft.com`).
Skip for internal-only.

## 17. `05_compliance_security.md` (Compliance + DevOps)

```markdown
# Compliance & Security — <DEPT>

## Compliance Standards
- CBAHI: <standard>
- JCI: <standard>
- ISO: <standard>
- PDPL: <consent template>
- Retention: <years>

## Security
- Threat model: STRIDE
- Pen test: quarterly
- Vuln scan: weekly
- Secret hygiene: env-only

## DevOps
- CI/CD: GitHub Actions
- Deploy: pm2 + Hetzner
- Rollback: <RTO/RPO>
- Monitoring: Datadog or self-hosted Prometheus
```

## 18. `05b_testing_qa.md` (Architect)

```markdown
# Testing & QA — <DEPT>

## Unit Tests
- <list of pure functions>
- File: namaweb/<dept>_test.js
- Run: node <dept>_test.js

## Integration Tests
- DB + RLS: <list>
- API end-to-end: <list>
- File: namaweb/<dept>_integration_test.js

## E2E Tests
- User story → curl
- File: namaweb/<dept>_e2e_test.sh

## CI Gate
- `npm run test:safe` must pass
```

## 19. `05c_deployment.md` (DevOps)

```markdown
# Deployment — <DEPT>

## Pre-deploy
1. Backup DB: `restore_db.sh`
2. Verify migrations on staging
3. Verify smoke e2e on staging

## Deploy
1. `pm2 stop nama-medical-erp`
2. `rsync` new files
3. `node --check server.js`
4. `pm2 start nama-medical-erp`
5. `curl /api/health` → UP

## Rollback
1. Restore from backup
2. `pm2 restart`
3. Verify health UP

## RTO/RPO
- RTO: 5 min
- RPO: 1 hour
```

## 20. `05d_apm_logging.md` (DevOps)

```markdown
# APM & Logging — <DEPT>

## Spans
- <list of key spans>

## Logs
- Format: JSON
- Fields: timestamp, level, request_id, user_id, tenant_id, action, latency_ms, status

## Alerts
- Error rate > 1% → Slack
- Latency p95 > 500ms → Slack
```

## 21. `05e_user_analytics.md` (PM + Architect)

```markdown
# User Analytics — <DEPT>

## Events
- page_view: {dept, page, user_id, ts}
- action: {dept, action, user_id, ts}
- error: {dept, code, user_id, ts}

## Funnels
- Triage → Assessment: target 80% within 30 min
- Assessment → Plan: target 90% within 2h
```

## 22. `05f_pentest_plan.md` (DevOps)

```markdown
# Pentest Plan — <DEPT>

## Scope
- New routes
- New tables
- New engines

## Method
- OWASP Top 10
- STRIDE
- Manual + automated (Burp, ZAP)

## Frequency
- Pre-release: full
- Quarterly: smoke

## Reporting
- Findings → Jira
- Severity CVSS 7+ → fix within 7 days
```

## 23. `06_erd.dbml` (Architect)

DBML fragment.

## 24. `06_openapi.yaml` (Architect)

OpenAPI fragment.

## 25. `06b_seeders.sql` (Architect)

```sql
-- Dummy data only (no real PHI)
INSERT INTO <table> (tenant_id, ...) VALUES (1, ...);
```

## 26. `06c_migration_up.sql` (Architect)

```sql
-- up.sql
BEGIN;
CREATE TABLE ...;
-- RLS
ALTER TABLE ... ENABLE ROW LEVEL SECURITY;
ALTER TABLE ... FORCE ROW LEVEL SECURITY;
CREATE POLICY ...;
COMMIT;
```

## 27. `06c_migration_down.sql` (Architect)

```sql
-- down.sql (non-destructive, never DROP data)
BEGIN;
DROP POLICY IF EXISTS ... ON ...;
ALTER TABLE ... NO FORCE ROW LEVEL SECURITY;
ALTER TABLE ... DISABLE ROW LEVEL SECURITY;
-- DROP TABLE only if owner-authorized
COMMIT;
```

## 28. `06c_migration_validate.sql` (Architect)

```sql
-- validate.sql
SELECT COUNT(*) FROM <table>;  -- must return > 0 after seed
```

## 29. `07_user_manual.md` (PM)

AR/EN user manual.

## 30. `07b_training_video_script.md` (PM)

Video outline (no actual video file).

## 31. `08_pm_sprint.md` (PM)

Agile sprint plan.

## 32. `08b_tasks.csv` (PM)

CSV task list.

## 33. `08c_budget.md` (PM + AI)

LLM cost estimate.

## 34. `09_helpdesk.md` (PM)

Helpdesk workflow.

## 35. `09b_gtm.md` (PM)

Go-to-market (if public-facing).

---

## Token-Saving Notes

- Use the **shared `snippets.md`** for any paragraph that appears in > 3 dept specs.
- Multi-agent: split a batch of 9 depts across 5 sub-agents (2 each + 1 orchestrator).
- Skip sections not relevant to a given dept (e.g., `04d_seo.md` for internal-only).
- For each new dept, **read the cluster brain.md ONCE**, then never re-read in this session.

---

End of per-dept template.
