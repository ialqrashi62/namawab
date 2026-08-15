# CARD-302_ADHF — LLM Observability

## Trace Configuration

```yaml
project: nama-medical-ahf
environment: production
endpoints:
  - name: gdmt_recommendation
    trace_name: "gdmt_recommendation_{patient_id}"
    metadata:
      tenant_id: integer
      patient_id: integer
      ef_pct: integer
      nyha_class: integer
      pillars_recommended: integer
    tags: ["ahf", "gdmt", "clinical-ai"]

  - name: scai_shock_staging
    trace_name: "scai_shock_{patient_id}"
    metadata:
      tenant_id: integer
      patient_id: integer
      sbp: integer
      lactate: number
      stage: string
    tags: ["ahf", "shock", "safety-critical"]

  - name: lvad_checklist
    trace_name: "lvad_checklist_{patient_id}"
    metadata:
      tenant_id: integer
      patient_id: integer
      ready: boolean
      completed: integer
    tags: ["ahf", "lvad", "screening"]

  - name: transplant_listing
    trace_name: "transplant_listing_{patient_id}"
    metadata:
      tenant_id: integer
      patient_id: integer
      status: string
    tags: ["ahf", "transplant", "scot"]

  - name: rag_query
    trace_name: "ahf_rag_{query_hash}"
    metadata:
      tenant_id: integer
      user_id: integer
      query: string
      top_k: integer
      language: string
    tags: ["ahf", "rag", "aha-acc"]
```

## Safety Guardrails

```python
ALLOWED = [
    "citation_count >= 1",
    "no_personal_data_in_trace",
    "tenant_id_present",
    "language_in_supported",
    "answer_within_token_limit",
]

BLOCKED = [
    "lvad_without_evaluation",
    "transplant_without_scot",
    "arni_with_high_potassium",
    "arni_with_low_bp",
    "arni_with_acei_no_washout",
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

## Eval Dataset

```yaml
eval_set:
  - q: "GDMT 4-pillar for HFrEF patient with EF 25, K 4.5, GFR 60, SBP 110?"
    expected: all_4_pillars_eligible
  - q: "Sacubitril/Valsartan dose for 70 kg patient on lisinopril 20 mg?"
    expected: "dose_24_26_after_36h_washout"
  - q: "SCAI stage for SBP 75, lactate 4, on 2 inotropes?"
    expected: stage_C
  - q: "LVAD checklist status?"
    expected: requires_evaluation_10_items
  - q: "Transplant status for INTERMACS 1 on ECMO?"
    expected: status_1A
```

## Compliance

| Rail | How Verified |
|---|---|
| 1 — No secrets | Env vars only |
| 2 — No PHI in commits | Trace in LangSmith cloud |
| 5 — Tenant isolation | Metadata always |
| 10 — Audit log | Hash-chained |
| 12 — No PHI in logs | PII redaction |
| 13 — Golden Access | Role check |
