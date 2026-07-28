# 31 — Acceptance Criteria (CARD-001)

> Owner: PM/UX · Tier 1

## Feature: Cardiology Co-pilot (US-CARD-009)

| AC ID | Criterion | Test |
|-------|-----------|------|
| AC-CARD-009-01 | Co-pilot returns AR-primary answer with EN secondary | unit + manual |
| AC-CARD-009-02 | Every answer cites a guideline source (ACC/AHA 2024, ESC 2023, or NPHIES) | unit (regex check) |
| AC-CARD-009-03 | Evidence level (A/B/C) included in every response | unit |
| AC-CARD-009-04 | Refuses on missing patient context | unit |
| AC-CARD-009-05 | RLS: cannot access another tenant's data | integration (cross-tenant test) |
| AC-CARD-009-06 | red_flag=true → also POST red_flag activation | integration |
| AC-CARD-009-07 | LLM trace_id stored in cardio_copilot_queries | unit |
| AC-CARD-009-08 | Monthly cost per tenant < $100 (Langfuse alert) | monitoring |
| AC-CARD-009-09 | p95 latency < 3s | load test |
| AC-CARD-009-10 | Refusal rate in production < 5% | monitoring |

## Feature: CODE STEMI Activation (US-CARD-005, US-CARD-012)

| AC ID | Criterion | Test |
|-------|-----------|------|
| AC-CARD-005-01 | Activation within 30s of trigger | integration |
| AC-CARD-005-02 | Page sent to cardiologist + cath team + ER doc (parallel) | integration |
| AC-CARD-005-03 | Audit CRITICAL entry written within 1s | integration |
| AC-CARD-005-04 | 4-eye cardiologist sign-off required before cath | workflow |
| AC-CARD-005-05 | Idempotency: same key within 24h returns original | unit |
| AC-CARD-005-06 | RLS: cross-tenant activation blocked | integration |
| AC-CARD-005-07 | SLA timer starts on activation, alert on breach | monitoring |
| AC-CARD-005-08 | Push notification + SMS fallback | integration |
| AC-CARD-005-09 | AR + EN pages | manual |
| AC-CARD-005-10 | Audit chain unbroken | unit |

## Feature: HF GDMT Optimizer (US-CARD-004)

| AC ID | Criterion | Test |
|-------|-----------|------|
| AC-CARD-004-01 | Returns valid recommendations for HFrEF (EF<40) | unit |
| AC-CARD-004-02 | Applies CDS: hyperkalemia, eGFR, BP, HR | unit |
| AC-CARD-004-03 | redFlag on K>=6.0, eGFR<15, SBP<80, HR<50 | unit |
| AC-CARD-004-04 | Cites ACC/AHA 2024 + ESC 2023 | unit |
| AC-CARD-004-05 | RLS: cannot access another tenant's meds | integration |
| AC-CARD-004-06 | Cites current meds + allergies in output | unit |
| AC-CARD-004-07 | Provider can apply changes with one click (audit + Rx) | workflow |

## Feature: Cath Lab Money (US-CARD-006, US-CARD-011)

| AC ID | Criterion | Test |
|-------|-----------|------|
| AC-CARD-006-01 | Idempotency-Key required | unit |
| AC-CARD-006-02 | Same key within 24h returns original response | unit |
| AC-CARD-006-03 | Amount calculated server-side (no client total) | integration |
| AC-CARD-006-04 | NPHIES bundle resolved automatically | unit |
| AC-CARD-006-05 | Doctor sign-off required before submit | workflow |
| AC-CARD-006-06 | Submit failure → queued for retry, no double-claim | integration |
| AC-CARD-006-07 | RLS: cannot claim from another tenant | integration |
| AC-CARD-006-08 | Audit hash-chained | unit |
| AC-CARD-006-09 | Eligibility check before submit | integration |
| AC-CARD-006-10 | 7+ year retention of claim + audit | policy |

## Non-functional acceptance

| AC ID | Criterion | Target |
|-------|-----------|--------|
| AC-CARD-NF-01 | p50 API latency | < 200ms |
| AC-CARD-NF-02 | p95 API latency | < 500ms |
| AC-CARD-NF-03 | p99 API latency | < 1500ms |
| AC-CARD-NF-04 | Uptime | 99.9% |
| AC-CARD-NF-05 | RLS coverage | 100% of cardio tables |
| AC-CARD-NF-06 | Test coverage | 80% unit, 100% critical paths |
| AC-CARD-NF-07 | WCAG 2.1 AA | 100% pass on axe |
| AC-CARD-NF-08 | Translation coverage | 100% AR + EN |
| AC-CARD-NF-09 | Encoding | UTF-8 no BOM |
| AC-CARD-NF-10 | Audit log retention | 7+ years |
