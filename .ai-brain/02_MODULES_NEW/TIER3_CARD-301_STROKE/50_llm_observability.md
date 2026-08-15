# CARD-301_STROKE — LLM Observability (LangSmith)

## Trace Configuration

```yaml
project: nama-medical-stroke
environment: production
endpoints:
  - name: nihss_explanation
    trace_name: "explain_nihss_{patient_id}"
    metadata:
      tenant_id: integer
      doctor_id: integer
      nihss_score: integer
      severity: string
    tags: ["stroke", "nihss", "clinical-ai"]

  - name: thrombolysis_decision
    trace_name: "thrombolysis_recommendation_{patient_id}"
    metadata:
      tenant_id: integer
      patient_id: integer
      eligible: boolean
      agent: string
    tags: ["stroke", "thrombolysis", "safety-critical"]

  - name: rag_query
    trace_name: "stroke_rag_{query_hash}"
    metadata:
      tenant_id: integer
      user_id: integer
      query: string
      top_k: 5
      language: string
    tags: ["stroke", "rag", "aha-asa"]

  - name: tenecteplase_dose
    trace_name: "tenecteplase_dose_{patient_id}"
    metadata:
      tenant_id: integer
      weight_kg: number
      dose_mg: number
    tags: ["stroke", "dosing", "safety-critical"]
```

## Safety Guardrails (must verify)

```python
ALLOWED = [
    "citation_count >= 1",
    "no_personal_data_in_trace",
    "tenant_id_present",
    "language_in_supported",
    "answer_within_token_limit",
]

BLOCKED = [
    "thrombolysis_without_imaging_check",
    "dose_out_of_range",
    "patient_id_in_query",
    "phi_in_response",
    "disclaimer_missing",
]
```

## Cost Tracking

| Metric | Target |
|---|---|
| Avg tokens per query | < 800 |
| Avg cost per query | < $0.01 |
| P95 latency | < 3s |
| Cache hit rate | > 30% |
| Citation accuracy | > 98% |

## Alerting Rules

```yaml
alerts:
  - name: high_cost_spike
    condition: "avg_cost_per_query > 0.05"
    window: 1h
    severity: warn

  - name: low_citation_rate
    condition: "citation_count < 1"
    window: 1h
    severity: page

  - name: thombolysis_decision_drift
    condition: "model_output != expected_pattern"
    window: 24h
    severity: critical

  - name: phi_leak
    condition: "phi_pattern_detected"
    window: 1m
    severity: critical
```

## Eval Dataset

```yaml
eval_set:
  - q: "What's the NIHSS score for a patient with mild right arm weakness?"
    expected: low_score_mild_severity
  - q: "Is thrombolysis indicated for a patient with INR 2.5?"
    expected: exclusion_inr_high
  - q: "Tenecteplase dose for 70 kg patient?"
    expected: dose_17.5_mg
  - q: "Door-to-needle target?"
    expected: 60_min
  - q: "CHA2DS2-VASc score for 80y female with AFib?"
    expected: high_score_anticoag_recommended
```

## LangSmith Logging

```javascript
// In each LLM call
const langsmith = require('langsmith');
const tracer = new langsmith.Client({
  apiKey: process.env.LANGSMITH_API_KEY,
  projectName: 'nama-medical-stroke',
});

await tracer.trace({
  name: 'nihss_explanation',
  inputs: { nihss_subscores },
  outputs: { total_score, severity },
  metadata: { tenant_id, patient_id, doctor_id },
  tags: ['stroke', 'nihss'],
});
```

## RAG Quality Monitoring

| Metric | Target | Eval |
|---|---|---|
| Retrieval Recall@10 | ≥ 0.95 | 50 queries |
| MRR | ≥ 0.85 | 50 queries |
| Citation accuracy | ≥ 0.98 | 100 queries |
| Hallucination rate | < 2% | 100 queries |
| Latency P95 | < 3s | Daily |

## Compliance with Rails (AGENTS.md §2.2)

| Rail | How Verified |
|---|---|
| 1 — No secrets | All API keys in env, never in trace |
| 2 — No PHI in commit | Trace ingested to LangSmith cloud, not in repo |
| 5 — Tenant isolation | tenant_id in every trace metadata |
| 10 — Audit log | Hash-chained + trace_id |
| 12 — No PHI in logs | PII redaction in trace fields |
| 13 — Golden Access | Role check before LLM call |
