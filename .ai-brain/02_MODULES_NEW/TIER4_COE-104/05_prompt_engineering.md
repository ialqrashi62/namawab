# COE-104 — Prompt Engineering

```yaml
- id: PROMPT:COE-104:main_assessment
  version: 1.0.0
  status: draft
  owner: CMO
  dept: COE-104
  safety_class: standard
  requires_red_flag_check: true
  requires_drug_check: false
  requires_citation: true
  input_schema_ref: SCHEMA:coe_104_input
  output_schema_ref: SCHEMA:coe_104_output
  guardrail_set_id: GRD:COE-104:v1
  citations_required: 2
  max_tokens: 1000
  temperature: 0.1
  model_target: gpt-4o
```

## Guardrails
- Pre: phi_redact, tenant_check, specialty_scope
- Post: red_flag, citation_required, confidence_threshold, pii_audit

## Few-shot (3-5)

Examples tailored to Stroke Center.

---

*Owner: AIE+CMO — 2026-08-01*
