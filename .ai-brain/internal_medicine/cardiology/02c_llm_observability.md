# LLM Observability — Cardiology

> **Owner:** AI Engineer
> **Date:** 2026-07-22
> **Tool:** LangFuse (self-hosted) + custom metrics

---

## Tracked Metrics

| Metric | Target | Alert threshold |
|---|---|---|
| Request count | — | — |
| Latency p50 | <1s | >2s |
| Latency p95 | <2s | >3s |
| Latency p99 | <4s | >5s |
| Token usage (input) | <500/query | >1000/query |
| Token usage (output) | <800/query | >1500/query |
| Cost per query | <$0.01 | >$0.02 |
| Error rate | <0.5% | >2% |
| Hallucination rate | <2% | >5% |
| Refusal rate | <10% (out of scope) | >20% (too aggressive) |
| Acceptance rate | >60% | <40% |

## LangFuse Integration

```js
const { Langfuse } = require('langfuse');
const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_BASE_URL  // self-hosted
});

async function cardiologyCdsWithTrace(input) {
  const trace = langfuse.trace({
    name: 'cardiology.cds',
    userId: input.patient_id,
    sessionId: input.encounter_id,
    metadata: { cluster: 'cardiology', tenant: input.tenant_id }
  });
  // ... retrieval, generation, validation ...
  trace.update({ output: result, usage: { tokens, cost } });
  return result;
}
```

## Eval Set (golden Q&A)

- 50 expert-reviewed Q&A pairs
- Stored in `cardiology_eval_set.json`
- Run on every prompt-template change (CI gate)
- Pass threshold: 90% accuracy (clinician agrees with LLM suggestion)

## Cost Tracking

- Daily budget: $50 (configurable per tenant)
- Per-query cost: ~$0.005 (gpt-4o-mini, 500 input + 800 output)
- Monthly budget: $1500
- Alert at 80% of budget

## Latency Budget

- Embedding: 200ms
- Retrieval: 100ms
- Re-rank: 200ms
- LLM call: 1500ms
- Validation: 50ms
- **Total p95: 2s**

## Failure Modes

| Failure | Detection | Recovery |
|---|---|---|
| OpenAI 5xx | LangFuse error | Retry 1x, then deterministic fallback |
| OpenAI timeout (>5s) | LangFuse error | Return 503 + deterministic fallback |
| pgvector down | Health check | Use REAL[] fallback |
| Tenant context missing | Middleware | 401 fail-closed |
| Chunk score <0.7 | Post-filter | Return "no evidence" |

## Compliance

- Every prompt + response logged (7-year retention, hash-chained audit)
- PII redacted in logs (replace names/IDs with patient_id)
- No model improvement without explicit user opt-in (per PDPL)

---

End of LLM observability spec.
