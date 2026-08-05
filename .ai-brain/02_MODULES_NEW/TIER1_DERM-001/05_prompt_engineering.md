# DERM-001 — Prompt Engineering

## Prompt Registry Entry

```yaml
- id: PROMPT:DERM-001:initial_assessment
  version: 1.0.0
  status: draft
  owner: CMO
  dept: DERM-001
  languages: [ar, en]
  tier: 1
  safety_class: critical
  requires_red_flag_check: true
  requires_drug_check: true
  requires_citation: true
  input_schema_ref: SCHEMA:derm_001_encounter_input
  output_schema_ref: SCHEMA:derm_001_assessment_output
  guardrail_set_id: GRD:DERM-001:v1
  citations_required: 3
  max_tokens: 1500
  temperature: 0.1
  model_target: gpt-4o
  eval_id: EVAL:DERM-001:initial_assessment
  few_shot_count: 5
```

## Guardrails (per GRD:DERM-001:v1)

- Pre: phi_redact, tenant_check, specialty_scope
- Post: red_flag, drug_interaction, citation_required, confidence_threshold, pii_audit

## Few-shot examples (5-10)

- top conditions from 03_icd10_snomed_map.md
- each with: patient summary, expected reasoning, citations, expected output ref

## Eval

```
npm run prompt:eval -- --id=PROMPT:DERM-001:initial_assessment
```

---

*Owner: AIE+CMO — 2026-08-01*
