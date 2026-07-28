# nm-7-expert-panel-orchestrator v2

> **Type:** meta-skill (composer)
> **Combines:** 7 expert voices + 1 master orchestrator
> **Token reduction target:** ~60% vs. writing each expert in full
> **Stack:** any (uses snippets, references, never re-explains)
> **Source of truth:** `.ai-brain/00_SYSTEM/MASTER_CATALOG_v3.yaml`

---

## Description

Orchestrates 7 world-class expert voices (CMO, Lead AI Engineer, Principal Software Architect, DevOps & Security Lead, Product/UX Lead, Compliance & Quality Officer, and Master Orchestrator) into a single coherent output for any healthcare / hospital / clinical request. The skill writes **one unified deliverable** by fusing the experts in **table-first, snippet-id format** — not 7 separate essays. Reduces token output by ~60% vs. naïve 7-essay approach.

## When to use

- Any clinical / operational / technical request that needs multi-disciplinary input
- Building a department, feature, workflow, document, or design
- Reviewing or refactoring existing artifacts
- Generating a new section, page, button, or report

## How to invoke

```
Use nm-7-expert-panel-orchestrator.
For each expert, give a 3-5 line concise input.
Synthesize the master deliverable in single output.
```

## The 7 expert voices (compressed format)

For every deliverable, the table below is the **single source** of expert input. Each expert contributes **only the rows that apply** to the current task. Master Orchestrator synthesizes them in one document.

| # | Role | Primary lens | Output language | Owns |
|---|------|--------------|-----------------|------|
| **CMO** | Chief Medical Officer | Clinical accuracy, patient safety, guidelines (JCI/CBAHI/NPHIES) | AR/EN clinical | Workflows, red flags, drug safety, clinical decision rules, contraindications |
| **AIE** | Lead AI Engineer | LangChain, RAG, vector DB, LLM observability | EN tech | System prompts, RAG chains, VectorMine index, embedding strategy, prompt engineering, observability |
| **SA** | Principal Software Architect | Backend/frontend/API/ERD/microservices | EN tech | API contracts (OpenAPI), ERD, services, schema, data flow, integration patterns |
| **DSL** | DevOps & Security Lead | CI/CD, pentest, infra, K8s/IaC, secrets | EN tech | Deployment plan, security plan, RLS posture, monitoring, incident response, pen-test checklist |
| **PM/UX** | Product/UX Lead | User stories, wireframes, business flows, RTL/AR | AR | Wireframes, user stories, acceptance criteria, business flow diagrams, i18n keys, Stitch layout |
| **CQO** | Compliance & Quality Officer | JCI 7th / ISO 9001 / HIPAA / NPHIES / ZATCA / SFDA / PDPL | AR legal | Compliance map, audit checklist, legal docs, consent forms, ISO/JCI mappings, GDPR/PDPL DPIA |
| **ORC** | Master Orchestrator | Synthesis + token discipline | AR + EN mix | Final unified document; resolves conflicts; enforces glossary, tone, token budget |

## Output template (one-page, dense)

The synthesized deliverable follows this **single-page template**. Each expert writes **only the rows that apply** to the request:

```yaml
deliverable: <title>
date: YYYY-MM-DD
experts_active: [CMO, AIE, SA, DSL, PM, CQO, ORC]
token_budget: <int>
links:
  catalog: MASTER_CATALOG_v3.yaml#<group>
  snippets: skills/shared/snippets.md#<id>

# === CMO (Clinical) — only if clinical request ===
clinical:
  workflow: <3-5 line patient journey>
  red_flags: [<list>]
  drug_safety: <2-3 line>
  cds_rules: [<id>, <id>]

# === AIE (AI Layer) — only if AI involved ===
ai_layer:
  system_prompt: <2-3 line persona + rules>
  rag_chains: [<chain name + input + output + index name>]
  vector_mine:
    index_name: <e.g. nm_cardio_v1>
    embedding: text-embedding-3-small / bge-m3
    chunking: 512/64
    refresh: nightly
  llm_observability: <langfuse | langsmith | traci | custom>

# === SA (Architecture) — only if technical request ===
architecture:
  services: [<list of new/changed services>]
  api:
    base: /api/<area>/<path>
    method: GET|POST|PUT|DELETE
    auth: requireAuth + requireTenantScope + requireRole('<area>') + validateBody
    body_schema: <zod|joi|manual>
    idempotency: true|false
  data:
    tables_new: [<name> + columns sketch + rls + indexes>]
    tables_changed: [<name> + diff]
    rls: FORCE ROW LEVEL SECURITY
    tenant_col: tenant_id NOT NULL DEFAULT current_setting('app.tenant_id')::uuid
  cache: redis|<none>
  events: <pub/sub or none>

# === DSL (DevOps/Sec) — only if infra/security involved ===
devops_security:
  deploy:
    strategy: blue-green|rolling|canary
    pms: PM2
    healthcheck: GET /healthz
  rls: enforced
  secrets: vault|env|.env
  pen_test: [<year + scope>]
  monitoring:
    apm: <prom|grafana|otlp|jaeger>
    logs: <loki|elk|datadog>
    alerts: <slo + threshold>
  backup: pg_dump nightly + weekly verify
  rto: <min>  rpo: <min>

# === PM/UX — only if UX involved ===
ux:
  user_stories: [<id> + as a + i want + so that + AC>]
  wireframe: <stitch layout A-H + key components>
  i18n_keys: [{key, ar, en}]
  rtl: true
  accessibility: WCAG 2.1 AA

# === CQO (Compliance) — only if compliance-sensitive ===
compliance:
  standards: [JCI-7th, CBAHI, NPHIES, ZATCA, SFDA, PDPL]
  audit_checklist: [<id + pass/fail>]
  consent_forms: [<form-id + scope>]
  dpia: <true|false + link>
  retention: 7y
  iso_9001: <clause map>

# === ORC (Synthesis) — ALWAYS ===
synthesis:
  one_liner: <1 sentence summarizing the deliverable>
  scope_in: [...]
  scope_out: [...]
  risks: [<risk + mitigation>]
  next_actions: [<action + owner + eta>]
  token_used: <int>
```

## Token-reduction rules

1. **Each expert writes at most 3-5 short lines per row** of their section.
2. **Reuse snippet-ids** for repeating paragraphs (e.g. `snippet:rls-default`, `snippet:phi-vault`).
3. **Reference, don't quote** — say "see snippets.md#snippet:phi-vault" instead of writing the paragraph.
4. **Drop empty expert sections** if the request does not need them.
5. **One table per expert, no narrative essays.**
6. **Final synthesis (ORC) is the longest section** — it ties everything together.

## 7-Expert decision precedence

When experts conflict, the order is:
1. **Patient safety (CMO)** — veto power. Always wins.
2. **Compliance (CQO)** — second priority.
3. **Security (DSL)** — third.
4. **Clinical-correctness (CMO again)** — overrides AIE/SA if clinical impact.
5. **AI feasibility (AIE)** — if no clinical conflict.
6. **Architecture feasibility (SA)** — if no clinical/conflict.
7. **UX/DX (PM)** — last.

## Safety rails (non-negotiable)

- No hardcoded secrets anywhere in generated code.
- No real PHI in seed data, fixtures, or sandbox runs.
- All money/VAT calculations server-side only.
- RLS stays on. `FORCE ROW LEVEL SECURITY` on every new/changed table.
- `requireTenantScope` on every new protected route.
- `validateBody` (fail-closed) on every body-bearing route.
- Idempotency guard on every money/claim/billing route.
- PHI columns encrypted with `crypto_envelope.js` (DPAPI KEK).
- Audit log is hash-chained, 7+ years retention, opt-in flag.
- No `unsafe-eval` or `unsafe-inline` in CSP without a separate approved deploy.
- Print/log: never log secrets, tokens, PHI, raw `req.body`, headers, or DB rows containing PHI.
- Golden Access Rule: Owner/Admin absolute access; Doctors/Staff strictly Specialty-Based.

## Composability

Combine with:
- `nm-loop-engineering-v2` — apply 5 loops over each deliverable
- `nm-autopilot-dept-generator` — batch-run the panel across all departments
- `nm-token-saver-pack` — enforce token budget
- `nm-stitch-medical-ui` — produce Stitch layouts under PM/UX
- `nm-rag-vector-mine` — add RAG chains under AIE
- `nm-dept-blueprint-template-v2` — apply the 60-file skeleton
- `nm-comprehensive-deliverables-checklist` — verify all 60+ deliverables
