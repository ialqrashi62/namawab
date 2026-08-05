# COE-107 — Prompt Engineering

```yaml
- id: PROMPT:COE-107:main_assessment
  version: 1.0.0
  status: draft
  owner: CMO
  dept: COE-107
  safety_class: standard
  requires_red_flag_check: true
  requires_drug_check: false
  requires_citation: true
  input_schema_ref: SCHEMA:coe_107_input
  output_schema_ref: SCHEMA:coe_107_output
  guardrail_set_id: GRD:COE-107:v1
  citations_required: 2
  max_tokens: 1000
  temperature: 0.1
  model_target: gpt-4o
```

## Guardrails
- Pre: phi_redact, tenant_check, specialty_scope
- Post: red_flag, citation_required, confidence_threshold, pii_audit

## Few-shot (3-5)

Examples tailored to Children's Pavilion.

---

*Owner: AIE+CMO — 2026-08-01*
