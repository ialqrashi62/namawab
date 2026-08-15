# CARD-304_ROBOTIC — LLM Observability

## Trace Configuration

```yaml
project: nama-medical-robotic-cv
environment: production
endpoints:
  - name: sts_risk_calc
    trace_name: "sts_{patient_id}"
    metadata:
      tenant_id: integer
      patient_id: integer
      score: decimal
      risk: string
    tags: ["robotic-cv", "sts", "risk"]

  - name: heart_team_rec
    trace_name: "heart_team_{patient_id}"
    metadata:
      tenant_id: integer
      patient_id: integer
      decision: string
    tags: ["robotic-cv", "heart-team", "safety-critical"]

  - name: rag_query
    trace_name: "rcv_rag_{query_hash}"
    metadata:
      tenant_id: integer
      user_id: integer
      language: string
    tags: ["robotic-cv", "rag", "sts-acc"]
```

## Safety Guardrails

```python
ALLOWED = [
    "citation_count >= 1",
    "no_personal_data_in_trace",
    "tenant_id_present",
]

BLOCKED = [
    "surgery_without_heart_team",
    "tavi_without_annulus_size",
    "device_without_sfda_check",
    "patient_id_in_query",
    "phi_in_response",
    "missing_consent",
]
```

## Cost Tracking

| Metric | Target |
|---|---|
| Avg tokens/query | < 800 |
| Avg cost/query | < $0.01 |
| P95 latency | < 3s |
| Cache hit rate | > 30% |
| Citation accuracy | > 98% |

## Eval Dataset

```yaml
eval_set:
  - q: "STS risk for 80-year-old with EF 25%?"
    expected: high_risk
  - q: "TAVI eligibility for 75-year-old with severe AS?"
    expected: eligible_sapien_3_or_evolut
  - q: "MitraClip for MR Grade 4 with EF 35?"
    expected: coapt_eligible
  - q: "WATCHMAN for AF + GI bleeding?"
    expected: eligible
  - q: "Robotic surgery for 65-year-old BMI 30?"
    expected: eligible
```

## Compliance

| Rail | How Verified |
|---|---|
| 1 — No secrets | Env vars |
| 2 — No PHI in commits | Cloud trace |
| 5 — Tenant isolation | Metadata |
| 10 — Audit | Hash chain |
| 12 — No PHI in logs | PII redaction |
| 13 — Golden Access | Role check |
