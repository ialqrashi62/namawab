# 08 — Workflow Orchestration (CARD-001)

> Owner: AIE · Tier 1

## Multi-agent orchestration (LangGraph)

```
                ┌─────────────────┐
                │   Triage Agent  │  (classify: clinical_q | rx | red_flag | admin)
                └────────┬────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
  ┌──────────┐    ┌──────────┐     ┌──────────┐
  │ Clinical │    │   Rx     │     │ Red Flag │
  │  Agent   │    │  Agent   │     │  Agent   │
  │ (RAG)    │    │ (CDS)    │     │ (alert)  │
  └────┬─────┘    └────┬─────┘     └────┬─────┘
       │               │               │
       └───────────────┼───────────────┘
                       ▼
              ┌────────────────┐
              │ Reviewer Agent │  (citation check, refusal check)
              └────────┬───────┘
                       ▼
              ┌────────────────┐
              │  Final Output  │
              └────────────────┘
```

## Steps per query

1. **Triage** (50ms, cheap model): classify intent
2. **Retrieve** (200ms, vector search): top 5 chunks
3. **Rerank** (100ms, optional): cross-encoder
4. **Generate** (1-2s, LLM): structured response
5. **Review** (300ms, LLM): citation + refusal check
6. **Stream** to UI with red-flag priority

## Tool calls (function calling)

- `lookup_patient_context(patient_id)` — tenant-scoped, RLS enforced
- `lookup_active_medications(patient_id)` — CDS pre-check
- `lookup_recent_labs(patient_id, days=7)` — PHI-redacted
- `lookup_encounter(encounter_id)` — RLS enforced
- `submit_red_flag(rf_id, patient_id, severity)` — emits CODE protocol
- `check_nphies_eligibility(patient_id, service_code)` — read-only

## Observability hooks

- Langfuse trace: per-call latency, token usage, cost
- Audit: hash-chained entry per red-flag submission
- Alerts: red-flag SLA breach → page cardiologist on-call
