# REHAB-103 — Prompt Engineering

```yaml
- id: PROMPT:REHAB-103:main_assessment
  version: 1.0.0
  status: draft
  owner: CMO
  dept: REHAB-103
  safety_class: standard
  requires_red_flag_check: true
  requires_drug_check: false
  requires_citation: true
  input_schema_ref: SCHEMA:rehab_103_input
  output_schema_ref: SCHEMA:rehab_103_output
  guardrail_set_id: GRD:REHAB-103:v1
  citations_required: 2
  max_tokens: 1000
  temperature: 0.1
  model_target: gpt-4o
```

## Guardrails
- Pre: phi_redact, tenant_check, specialty_scope
- Post: red_flag, citation_required, confidence_threshold, pii_audit

## Few-shot (3-5)

Examples tailored to Speech & Swallowing.

---

*Owner: AIE+CMO — 2026-08-01*
