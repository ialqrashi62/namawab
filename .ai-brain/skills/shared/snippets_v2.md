# Shared Snippets v2 — Canonical Snippet Store
# Used by nm-token-saver-pack + nm-dept-blueprint-template-v2 + nm-rag-vector-mine
# Every snippet is <100 tokens. Reuse, never rewrite.
# Reference syntax: snippet:<id>

---

## snippet:rls-default

```sql
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
ALTER TABLE <table> FORCE ROW LEVEL SECURITY;
CREATE POLICY <table>_tenant_isolation ON <table>
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

---

## snippet:phi-vault

PHI columns are encrypted with `crypto_envelope.js` (DPAPI KEK). Sensitive files (DICOM, imaging, waveforms, genetic reports) live in `phi_vault/` outside webroot, served via `/api/phi-files/:id` with auth + RLS + audit. See `docs/PHASE_A3_PHI_ENCRYPTION_VAULT/`.

---

## snippet:stitch-3col

3-column station layout: worklist (RTL right) · active workspace with tabs (center) · actions/AI insights panel (RTL left). Stitch component IDs come from project `17612445146025313712`.

---

## snippet:golden-access

Owner/Admin has absolute access. Doctors/Staff have strict Specialty-Based Access — cannot access other specialties without explicit `cross_specialty_grant`. Enforced via `requireRole('<specialty>')` + `cross_specialty_grants` table.

---

## snippet:safety-gate

Middleware chain (in order): `requireAuth` → `requireTenantScope` → `requireRole('<area>')` → `validateBody(RS.<schema>)` → `idempotencyGuard` (money only) → handler. `validateBody` is fail-closed; missing tenant context → 403 in production.

---

## snippet:audit-hash

Audit log uses hash-chained entries (each row hashes the previous row + its own content). 7+ year retention. Audit middleware (`audit_middleware.js`) is **inert by default** — opt-in flag controls activation. Tamper detection is a release gate.

---

## snippet:money-vat

All money/VAT calculations are **server-side only** via `finance_engine.js` and `parseMoney` + `vatFromInclusive`. Never trust client totals, discount, or VAT. Money routes: `idempotencyGuard` + opt-in + fail-open.

---

## snippet:csp-report-only

CSP is **report-only by default** (`CSP_ENFORCE=false`). Enforcement is a separate approved deploy. `unsafe-eval` and `unsafe-inline` are forbidden outside that approved deploy.

---

## snippet:auth-mfa

Auth uses `express-session` (Redis + MemoryStore fallback) + bcrypt + TOTP MFA. Cookies: `Secure`, `HttpOnly`, `SameSite=Lax`. On HTTPS: all three enforced. On HTTP-only staging: secure flag relaxed, others enforced.

---

## snippet:idempotency

Money/claim/billing routes: `idempotencyGuard` derives key from `Idempotency-Key` header + tenant + user. Same key within 24h returns the original response. Behavior: opt-in + fail-open (if Redis down, allow but warn).

---

## snippet:ar-rtl

All UI supports AR + EN with RTL/LTR. Font: `IBM Plex Sans Arabic, Inter, system-ui`. i18n keys: `<scope>.<entity>.<field>` (e.g. `cardio.encounter.title_ar`). All user-input rendered to DOM goes through `escapeHTML` / `SafeHtml`.

---

## snippet:stitch-medical

Design tokens (canonical): `nm.p.500=#0E5A6B`, `nm.c.critical=#D32F2F`, `nm.c.warning=#F57C00`, `nm.c.success=#2E7D32`, `nm.s.canvas=#F7FAFB`, `nm.r.md=10px`, `nm.f.sans=IBM Plex Sans Arabic`. Full set in `nm-stitch-medical-ui/SKILL.md`.

---

## snippet:langchain-rag

LangChain + PGVector pattern: tenant-namespaced collection `nm_<group>_<topic>_v<n>`, retriever filters by `tenant_id` + `lang`, MMR `k=5, fetch_k=20, lambda=0.5`, reranker (optional), LLM with strict system prompt that refuses on missing context.

---

## snippet:vector-mine

VectorMine index naming: `<tenant>.<group>.<topic>.<version>` (e.g. `tenant_001.cardio.acs_2024.v1`). Embedding: `multilingual-e5-large` (1024d) for AR+EN. Chunking: 512/64 default. PII/PHI redacted before embedding. Refresh: nightly or on-write.

---

## snippet:openapi-3-1

```yaml
openapi: 3.1.0
info: { title: <area> API, version: 1.0.0 }
servers: [{ url: https://jumanasoft.com }]
security: [{ bearerAuth: [] }]
components:
  securitySchemes:
    bearerAuth: { type: http, scheme: bearer, bearerFormat: JWT }
```

---

## snippet:dbml-header

```dbml
Project nama_medical_<group> {
  database_type: 'PostgreSQL'
  Note: 'Multi-tenant via tenant_id + RLS'
}

Table <table> {
  id uuid [pk, default: `gen_random_uuid()`]
  tenant_id uuid [not null, ref: > tenants.id]
  ...
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  Note: 'RLS: FORCE ROW LEVEL SECURITY'
}
```

---

## snippet:adr-header

```markdown
# ADR-<NNNN>: <Title>

> Status: Proposed | Accepted | Deprecated | Superseded
> Date: YYYY-MM-DD
> Deciders: <list>
> Consulted: <list>
> Informed: <list>

## Context
<2-3 lines>

## Decision
<2-3 lines>

## Consequences
<2-3 lines>
```

---

## snippet:test-pattern

Test layout: `node:test` (preferred) or `jest`. Files colocated as `<module>_test.js`. Coverage target: 80% unit, 100% critical paths. Every test file must include: red-flag scenario, cross-tenant scenario, idempotency scenario (if money).

---

## snippet:dbml-tenant-default

```dbml
Table <table> {
  id uuid [pk]
  tenant_id uuid [not null, ref: > tenants.id, note: 'multi-tenant FK + RLS']
  ...
  Indexes { (tenant_id, <col>) }
  Note: 'RLS enabled, FORCE ROW LEVEL SECURITY'
}
```

---

## snippet:rls-up-down

```sql
-- 22_migration_up.sql
BEGIN;
CREATE TABLE <table> (..., tenant_id uuid NOT NULL REFERENCES tenants(id), ...);
ALTER TABLE <table> ENABLE ROW LEVEL SECURITY;
ALTER TABLE <table> FORCE ROW LEVEL SECURITY;
CREATE POLICY <table>_tenant ON <table>
  USING (tenant_id = current_setting('app.tenant_id')::uuid);
COMMIT;

-- 23_migration_down.sql
BEGIN;
DROP POLICY IF EXISTS <table>_tenant ON <table>;
DROP TABLE IF EXISTS <table>;
COMMIT;
```

---

## snippet:user-story

```yaml
- id: US-<area>-<NNN>
  as_a: <role>
  i_want: <action>
  so_that: <benefit>
  acceptance_criteria:
    - <criterion 1>
    - <criterion 2>
  red_flag: true|false
  rls_required: true
  arabic_ux: true
```

---

## snippet:stitch-station-layout-b

```yaml
layout: B # Sidebar + main + timeline
components:
  - { id: nav-sidebar, type: nav, position: 'col 1', i18n: 'common.nav' }
  - { id: main-tabs, type: tab, position: 'col 2', tabs: [encounter, orders, results, notes] }
  - { id: timeline, type: timeline, position: 'col 3', i18n: 'cardio.timeline' }
  - { id: red-flag-banner, type: alert, position: 'top', color: critical, condition: 'has_red_flag' }
data_sources: [encounters, orders, results, vitals, allergies]
states: [loading=skeleton, empty=empty_state, error=retry, success=toast]
```

---

## snippet:ccs-prompt-template

```yaml
system_prompt: |
  أنت <role> في قسم <dept>، مستشفى NamaMedical.
  التخصص: <keywords>.
  اللغة الأساسية: العربية. الثانوية: الإنجليزية.
  استند فقط على الـ context + clinical guidelines المعتمدة.
  لا تخترع. إذا غاب الدليل: قل "لا تتوفر معلومات كافية".
  التزم بـ: JCI 7th, CBAHI, MOH-KSA, NPHIES, ZATCA, SFDA, PDPL.
  احترام قاعدة الوصول الذهبية. لا تنشر PHI.
  cite: <format>
user_template: |
  سؤال: {question}
  patient_ctx (PHI-redacted): {ctx}
  retrieved: {docs}
  --
  أرجع: {answer_ar} · {source} · {evidence_level} · {warnings}
```

---

## snippet:red-flag-entry

```yaml
- id: rf-<area>-<NN>
  name_ar: <...>
  name_en: <...>
  criteria: <2-3 line>
  immediate_action: <2-3 line>
  notify: [role1, role2]
  sla_min: <int>
  snomed: <code>
  icd10: <code>
  cds_rule_id: <...>
  ui_highlight: critical_banner
```

---

## snippet:gpt-prompt-budget

```yaml
prompt_budget:
  per_call_input_tokens: 4000
  per_call_output_tokens: 1000
  monthly_per_tenant_cap_usd: 100
  alerts:
    - { threshold_pct: 80, action: notify_owner }
    - { threshold_pct: 100, action: throttle }
embedding_budget:
  monthly_per_tenant_cap_usd: 25
```

---

## snippet:closeout

```yaml
closeout:
  date: YYYY-MM-DD
  status: COMPLETED | BLOCKED | DEFERRED
  scope_delivered: [file list]
  scope_not_delivered: [list]
  safety_rails_applied: [1,2,3,5,9,11,12,13]
  compliance: { jci, cbahi, nphies, zatca, pdpl, sfda }
  performance: pass|fail
  security: pass|fail
  test_pct: <int>
  owner_signoff_required: true
  next_phase: <name>
```
