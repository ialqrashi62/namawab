# 20 — ADR (CARD-001)

> Owner: SA · Snippet: snippet:adr-header · Tier 1

## ADR-0001: Cardiology Co-pilot LLM choice

```markdown
# ADR-0001: Cardiology Co-pilot LLM

> Status: Accepted
> Date: 2026-07-27
> Deciders: AIE, CMO, SA, DSL
> Consulted: PM, CQO
> Informed: Owner

## Context
Cardiology co-pilot needs:
- High accuracy on guideline-based questions
- Strong multilingual (AR + EN)
- Function calling for CDS + patient context
- Reasonable cost per call
- Low hallucination rate

Options considered:
- A) GPT-4o (OpenAI) — best multilingual, function calling, $0.005/1k input
- B) Claude-3.5-Sonnet (Anthropic) — best reasoning, $0.003/1k input
- C) Local Llama-3-70B — privacy-first, slow, low multilingual
- D) Gemini-1.5-Pro — good, $0.00125/1k input, but weaker AR

## Decision
Use **GPT-4o** as primary with **Claude-3.5-Sonnet** as fallback for high-stakes queries (red-flag, drug change).
Local model reserved for offline fallback.

## Consequences
- Pros: best multilingual, fastest function calling, mature ecosystem
- Cons: data leaves tenant (PHI-redacted only), vendor lock-in, $100/tenant/month cap needed
- Mitigation: strict PHI redaction, per-tenant cost cap, fallback model
```

## ADR-0002: Cardiology imaging storage

```markdown
# ADR-0002: ECG, Echo, Cath, Fluoro storage

> Status: Accepted
> Date: 2026-07-27
> Deciders: SA, DSL, CQO
> Consulted: CMO, PM

## Context
Cardiology imaging (12-lead ECG PDFs, echo videos, cath DICOM, fluoro runs) are PHI.
Need: encrypted at rest, fast access for clinicians, audit trail, 7+ year retention.

Options:
- A) PostgreSQL BYTEA + crypto_envelope
- B) phi_vault/ filesystem + crypto_envelope (existing pattern)
- C) S3/MinIO + server-side encryption
- D) PACS (existing Orthanc sandbox)

## Decision
**Hybrid:** metadata in PostgreSQL (RLS), files in `phi_vault/` outside webroot, served via
`/api/phi-files/:id` with auth + RLS + audit. Existing `crypto_envelope.js` (DPAPI KEK) for DB columns.
PACS integration via Orthanc sandbox for cath/fluoro (DICOM).

## Consequences
- Pros: leverages existing pattern, no new infra, RLS on metadata
- Cons: filesystem scaling, manual backup
- Future: migrate to MinIO with tenant-namespaced buckets
```

## ADR-0003: Red-flag activation pattern

```markdown
# ADR-0003: Red-flag activation via auto-detect + manual button

> Status: Accepted
> Date: 2026-07-27
> Deciders: CMO, AIE, SA, DSL
> Consulted: CQO, PM

## Context
Cardiology has 15 red flags (rf-card-01..15). Detection happens via:
- ECG auto-interpret (engine)
- Lab results (troponin, BNP, K)
- Imaging (echo, cath)
- Manual activation by clinician

Need: clear protocol activation, notification, audit, SLA tracking.

## Decision
**Engine auto-detects** + **manual button** as backup. Activation creates `red_flag_activations`
row, paged to on-call team, audit CRITICAL entry, SLA timer starts. Cross-specialty
activation allowed (ER doctor can activate STEMI even if not cardiology).

## Consequences
- Pros: fast, no missed activations, full audit, cross-specialty
- Cons: false positives (e.g. old BBB read as STEMI) — handled by 4-eye cardiologist review
- Mitigation: CDS rule requires cardiologist sign-off within 30 min for invasive actions
```

## ADR-0004: Multi-tenant RAG isolation

```markdown
# ADR-0004: Vector index tenant isolation

> Status: Accepted
> Date: 2026-07-27
> Deciders: AIE, DSL, CQO

## Context
Vector store (PGVector) holds cardiology guidelines, drug interactions, ECG patterns,
local protocols, patient education. Must be tenant-isolated per Golden Access Rule.

## Decision
**Tenant-namespaced namespaces** (`tenant_<id>.<group>.<topic>.<version>`). Retriever
always filters by `tenant_id` + `lang`. Cross-tenant indexes (e.g. drug interactions)
are global with no PHI. Audit-log every retrieval with trace_id.

## Consequences
- Pros: defense-in-depth, easy to test, multi-tenant safe
- Cons: per-tenant indexing cost
- Mitigation: nightly batch re-index, cost guard per tenant
```

## ADR-0005: Cath lab money handling

```markdown
# ADR-0005: Cath lab procedure money + idempotency

> Status: Accepted
> Date: 2026-07-27
> Deciders: DSL, CQO, CMO
> Consulted: AIE, SA

## Context
Cath procedures are expensive (PCI, TAVR, devices). Money calculation must be server-side,
idempotent to prevent duplicate billing, with NPHIES submission.

## Decision
All cath + device routes require `Idempotency-Key` header. Server validates uniqueness
within 24h per tenant. Money calculation via `finance_engine.js`. NPHIES claim submission
after doctor sign-off, async. Failed claims queued for retry.

## Consequences
- Pros: no double-billing, server-side money, NPHIES compliant
- Cons: 24h lock — admin override needed for corrections
- Mitigation: 7-day audit + admin unlock flow
```
