# 13 — LLM Observability (CARD-001)

> Owner: AIE · Tier 1

## Stack

- **Tracing:** Langfuse (self-host on Kubernetes, canary: cloud)
- **Eval:** RAGAS (offline batch), DeepEval (CI gate)
- **Cost tracking:** Langfuse built-in + per-tenant cap
- **Drift detection:** Evidently AI (embedding drift weekly)
- **Red-team:** Promptfoo + Garak
- **Latency:** OTLP → Grafana Tempo
- **Logs:** Loki

## Per-call trace

```
langfuse.trace(
  name: cardio_qa_v1,
  user_id: <user_id>,
  session_id: <encounter_id>,
  tags: [dept=cardio, tenant=<tenant_id>, role=doctor],
  metadata: { red_flag: true|false, cds_rules: [...], nphies: true|false }
)
  ├── span: retrieve (200ms, 5 chunks, 2.5k tokens)
  ├── span: rerank (100ms, top 3)
  ├── span: llm_call (1200ms, 4k input, 1k output, $0.012)
  ├── span: parse (50ms)
  └── span: review (300ms, citation check)
```

## Eval suite (offline, run weekly)

- 100 cardiology Q&A prompts
- Metrics: faithfulness, answer relevance, context precision/recall, citation accuracy
- Thresholds: faithfulness > 0.85, citation accuracy > 0.95
- Failure → alert, do not block production but log

## Online metrics

- p50 / p95 / p99 latency
- Token usage per call
- Cost per call
- Refusal rate (target: <5% in production)
- Red-flag detection rate (target: > 99% for STEMI patterns)
- Hallucination rate (target: < 1%)

## Alerts

- p95 latency > 3s → notify DSL
- Cost > 80% monthly cap → notify owner + throttle at 100%
- Hallucination detected by reviewer → block + log
- Tenant isolation breach → page DSL + security team
- Embedding drift > 0.1 (cosine) → schedule re-embed

## Dashboards

- Langfuse dashboard: per-call view
- Grafana: latency, cost, error rate
- Custom: cardiology-specific KPIs (red-flag SLA, CDS override rate)

## Compliance

- All traces: hash-chained to audit log
- PHI redaction in trace metadata
- 7+ year retention
- Tenant-scoped trace access only
