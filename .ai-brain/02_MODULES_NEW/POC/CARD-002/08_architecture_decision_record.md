<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 — Architecture Decision Records (5 ADRs)

## ADR-001: Cath Lab Stack (Node.js + Express + PostgreSQL + Vanilla JS)

**Status:** Accepted
**Context:** Align with existing 
amaweb/ stack (per AGENTS.md §2 + DECISIONS_PENDING.md Option A).
**Decision:** Use Node.js 22 + Express 4 + PostgreSQL 16 + vanilla JS (no React, no TypeScript) for the cath lab module.
**Consequences:**
- ✅ Reuse existing middleware (auth, tenant scope, RBAC, validation, idempotency, audit)
- ✅ Reuse existing 150 RLS-forced tables + add 12 new
- ✅ Reuse existing 13 safety rails
- ❌ No advanced AI libraries (limited to LangChain via shim)
- ❌ Larger bundle (1.7 MB) but acceptable for hospital intranet

## ADR-002: Multi-Tenancy via RLS (NOT DB-per-Tenant)

**Status:** Accepted
**Context:** Multi-tenant SaaS for 16 facility types.
**Decision:** Single PostgreSQL database with 	enant_id on every table + FORCE ROW LEVEL SECURITY. App layer sets current_setting('app.tenant_id') per request.
**Consequences:**
- ✅ Easy backup, migration, upgrade (one DB)
- ✅ Defense-in-depth (middleware + DB RLS)
- ✅ FORCE_RLS prevents table owner from bypassing
- ❌ Connection pool size (mitigated by AsyncLocalStorage per 	enant_context_pg_session.js)
- ❌ Migrations must be backward-compatible

## ADR-003: Idempotency on Money Routes Only (GATE7)

**Status:** Accepted
**Context:** AGENTS.md §2.2 #6 — money routes idempotent + opt-in + fail-open.
**Decision:** Apply idempotencyGuard ONLY to 4 money/SFDA routes:
- POST /procedures (billing)
- POST /stent-registry (SFDA + billing)
- POST /consent/sign (NPHIES pre-auth)
- POST /door-to-balloon-timer (audit + KPI)
NOT to clinical reads.
**Consequences:**
- ✅ Money routes protected from double-charge
- ✅ Clinical reads fast (no Redis cache check)
- ❌ Manual Idempotency-Key header required for 4 routes

## ADR-004: LLM = Decision Support, NOT Authority (CMO Veto)

**Status:** Accepted
**Context:** Patient safety > AI convenience. AGENTS.md §2.2 #13 (Golden Access Rule).
**Decision:** LLM provides DRAFT for: cath report, MDT summary, DAPT recommendation, patient education. MD must review+sign. LLM NEVER autonomously:
- Signs consent
- Selects stent size
- Approves DAPT duration
- Completes procedure
- Activates STEMI without ECG confirm
**Consequences:**
- ✅ Patient safety: MD in the loop
- ✅ LLM failure → fall back to rule-based engine
- ❌ Slower than auto-approval (acceptable tradeoff)

## ADR-005: Observability via LangSmith + Helicone + OpenTelemetry

**Status:** Accepted
**Context:** MASTER_PROMPT_v3.md + AI_OBSERVABILITY.yaml.
**Decision:** All LLM calls traced to LangSmith; cost+latency tracked via Helicone; distributed tracing via OpenTelemetry; custom clinical metrics (D2B compliance, MD override rate).
**Consequences:**
- ✅ Hallucination detection via weekly sample review
- ✅ Drift monitoring (data + model + concept)
- ✅ Per-call audit (input/output hash, never raw PHI)
- ❌ PII redaction overhead (necessary for HIPAA/PDPL)

---
*Section 35 of CARD-002. SA voice. L1 DRAFT.*