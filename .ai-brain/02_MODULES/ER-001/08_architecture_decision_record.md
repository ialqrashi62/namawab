---
module_id: ER-001
section: 03_technical_arch
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Architecture Decision Records (ADR)

## ADR-001: Use Multi-Tenant Single Database with RLS

**Status:** ACCEPTED
**Date:** 2026-07-23
**Deciders:** SA, DSL, CQO

**Context:**
NamaMedical ERP serves 16 facility types across Saudi Arabia. Each facility is a separate tenant with strict data isolation requirements (PDPL, HIPAA, JCI).

**Decision:**
- Single PostgreSQL 16 database
- All tables have `tenant_id` column (NOT NULL)
- Row-Level Security (RLS) enabled + forced on all tables (`FORCE_RLS=150`)
- Tenant context from session (NOT header, GATE4)

**Consequences:**
- (+) Simple deployment, single backup
- (+) Defense-in-depth (app + DB)
- (+) Cost-effective
- (-) Noisy neighbor (one tenant can affect others if not careful with indexes)
- (-) Backup/restore is all-or-nothing (use PITR + selective restore)

**Alternatives Considered:**
- Database-per-tenant: too expensive operationally
- Schema-per-tenant: complex migrations, not supported by `nama_medical_app` role
- Application-only isolation: insufficient (single bug = data leak)

## ADR-002: Hash-Chained Audit Log (Not Plain Append-Only)

**Status:** ACCEPTED
**Date:** 2026-07-23
**Deciders:** DSL, CQO, AIE

**Context:**
JCI 7th + ISO 27001 + PDPL require immutable audit trail. 7+ year retention. Must detect tampering.

**Decision:**
- Every audit log entry includes `prev_hash` (SHA-256 of previous entry in same tenant)
- WORM storage (append-only, no UPDATE/DELETE)
- Verify chain periodically (background job)

**Consequences:**
- (+) Tamper-evident (any modification breaks chain)
- (+) Compliance-ready (JCI, ISO, PDPL)
- (+) Forensic analysis possible
- (-) Slight write overhead (~1ms per log)
- (-) Periodic chain verification needed

**Alternatives Considered:**
- Plain append-only: vulnerable to in-place modification
- Blockchain: too complex, too slow
- External SIEM: requires integration, network dependency

## ADR-003: Server-Side Authority for Clinical Decisions

**Status:** ACCEPTED
**Date:** 2026-07-23
**Deciders:** SA, CMO, DSL

**Context:**
Clinical calculations (CHA₂DS₂-VASc, MELD, qSOFA, etc.) are safety-critical. Client-side calculation = spoofing risk.

**Decision:**
- All clinical calculations server-side only (`/api/calculators/*`, `er_engine.js`)
- Client never computes scores
- Server returns `{value, severity, notes, citations}` — authoritative

**Consequences:**
- (+) Cannot be spoofed by malicious client
- (+) Single source of truth
- (+) Audit trail (every calculation logged)
- (-) Network latency (but typically <100ms)
- (-) No offline mode (acceptable for clinical decisions)

**Alternatives Considered:**
- Client-side: fast but spoofable
- Hybrid: complex, error-prone
- Cache results: not applicable (need real-time)

## ADR-004: Pure JS Engines (No Database Functions)

**Status:** ACCEPTED
**Date:** 2026-07-23
**Deciders:** SA, AIE

**Context:**
Clinical engines (scoring, calculations, workflows) need to be testable, version-controlled, and easy to modify.

**Decision:**
- All clinical engines: pure JavaScript modules (no DB functions, no stored procedures)
- `er_engine.js`, `cds.js`, `ews_engine.js`, etc. are pure functions
- I/O (DB, FHIR, LLM) in route handlers, not engines

**Consequences:**
- (+) Unit testable (no DB mock needed)
- (+) Version-controlled in Git
- (+) Reusable across services
- (+) Easy to refactor
- (-) Some logic duplicated (vs DB function)
- (-) Performance (JS slower than C, but acceptable for clinical scale)

## ADR-005: LLM Gateway with PII Redaction

**Status:** ACCEPTED
**Date:** 2026-07-23
**Deciders:** AIE, DSL, CQO

**Context:**
External LLM providers (OpenAI, Anthropic) cannot receive PHI per HIPAA/PDPL. But LLM is valuable for clinical decision support.

**Decision:**
- All LLM calls go through `llm_client.js` gateway
- PII auto-detected and redacted BEFORE sending to external LLM
- Patient ID, name, DOB, MRN, address, phone: replaced with synthetic tokens
- LLM response: de-redacted using lookup table (per session)
- Audit log: input hash + output hash (PII not stored, hash is non-reversible)

**Consequences:**
- (+) Compliant with HIPAA/PDPL
- (+) Can use best-in-class LLMs
- (+) Audit trail preserved
- (-) Slight latency overhead (redaction)
- (-) Some context loss (e.g., name might matter for some clinical context)

**Alternatives Considered:**
- Self-hosted LLM only: expensive, slower, less capable
- Block LLM use entirely: loses significant clinical value
- Differential privacy: still sends aggregate data, may leak

## ADR-006: Idempotency for Money Routes (Fail-Open)

**Status:** ACCEPTED
**Date:** 2026-07-23
**Deciders:** SA, DSL

**Context:**
Insurance claims, copays, payments are money routes. Network failures + retries = duplicate charges.

**Decision:**
- `idempotency.js` middleware for money routes
- Opt-in per route
- Fail-open: if idempotency check fails (Redis down), allow the request but log warning

**Consequences:**
- (+) Prevents duplicate charges
- (+) Audit trail (every request ID stored)
- (+) Fail-open = no outage if Redis down
- (-) Risk of duplicate if client retries with different request ID

## ADR-007: CSP Report-Only by Default

**Status:** ACCEPTED
**Date:** 2026-07-23
**Deciders:** DSL, PM

**Context:**
Strict CSP prevents many XSS attacks. But enforcing it breaks many third-party integrations (Google Maps, analytics, etc.).

**Decision:**
- CSP header in `report-only` mode by default
- Browser sends violation reports to `/api/csp-report`
- Production deploy: `CSP_ENFORCE=true` is a SEPARATE deploy, owner-approved

**Consequences:**
- (+) Detect violations without breaking UX
- (+) Migration path (gradual enforcement)
- (-) Reports can be noisy (filter required)
- (-) Until enforced, not fully protective

## ADR-008: Multi-Region DR with RPO <1h, RTO <4h

**Status:** ACCEPTED
**Date:** 2026-07-23
**Deciders:** DSL, COO

**Context:**
NamaMedical is a 24/7 ED. Downtime = patient safety risk. Regional outage possible.

**Decision:**
- Primary: Hetzner (Falkenstein or Helsinki)
- Secondary: different region (Nuremberg or Ashburn)
- Continuous WAL archiving to S3
- Cross-region replication (async)
- RPO: <1 hour (WAL archive interval)
- RTO: <4 hours (DNS failover + DB promotion + app start)
- DR drill: quarterly (game day)

**Consequences:**
- (+) Survives regional outage
- (+) HIPAA/PDPL aligned
- (-) Cost: 2x infrastructure (but acceptable for critical care)
- (-) DR drill is non-trivial (requires test environment)

---
*Section 03.h of ER-001. Owner: SA + DSL. L4 validated.*
