# CARD-303_ONCO — LLM Observability

## Trace Configuration

```yaml
project: nama-medical-cardio-onc
environment: production
endpoints:
  - name: hfa_icos_assessment
    trace_name: "hfa_icos_{patient_id}"
    metadata:
      tenant_id: integer
      patient_id: integer
      cancer_type: string
      score: integer
      risk: string
    tags: ["cardio-onc", "hfa-icos", "risk"]

  - name: ici_myocarditis_detection
    trace_name: "ici_myocarditis_{patient_id}"
    metadata:
      tenant_id: integer
      patient_id: integer
      ici_type: string
      severity: string
      troponin_uln: number
    tags: ["cardio-onc", "ici", "myocarditis", "safety-critical"]

  - name: rag_query
    trace_name: "coo_rag_{query_hash}"
    metadata:
      tenant_id: integer
      user_id: integer
      query: string
      language: string
    tags: ["cardio-onc", "rag", "esc-aha"]
```

## Safety Guardrails

```python
ALLOWED = [
    "citation_count >= 1",
    "no_personal_data_in_trace",
    "tenant_id_present",
    "answer_within_token_limit",
]

BLOCKED = [
    "ici_myocarditis_ignored",
    "anthracycline_dose_unchecked",
    "doac_without_gi_check",
    "cardiomyopathy_missed",
    "patient_id_in_query",
    "phi_in_response",
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
  - q: "HFA-ICOS risk for 65y breast cancer patient on doxorubicin 300 mg/m², baseline EF 55%"
    expected: high_risk
  - q: "ICI myocarditis treatment?"
    expected: high_dose_steroids
  - q: "VTE treatment for 70y pancreatic cancer patient?"
    expected: lmwh
  - q: "GLS drop 17% relative?"
    expected: hold_chemo
  - q: "Cumulative doxorubicin 450 mg/m² cardioprotection?"
    expected: dexrazoxane
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
