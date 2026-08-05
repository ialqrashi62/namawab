---
name: nm-prompt-engineering
description: Use when authoring, version managing, or auditing System Prompts, Few-shot Libraries, or Guardrails in NamaMedical. Enforces the central PROMPT_REGISTRY.yaml convention, citation-first responses, and safe-medical-LLM chaining. Required for any new orchestrator or AI feature. Prompt + System + Few-shot + Guardrails.
---

# nm-prompt-engineering

> **Purpose:** Single skill to rule all clinical prompts. Combines Epic's Best Practice Advisory discipline + Epic DAX specificity + Cerner template rigor + open-source LangChain prompting.

---

## 1. Activation triggers

Activate this skill when ANY of:

- Generating a new AI orchestrator for a dept
- Adding/changing a System Prompt
- Adding Few-shot examples
- Editing Guardrails (pre/post-LLM)
- Adding new prompt variables (patient context, encounter type)
- Auditing an existing orchestrator for safety

---

## 2. The Central PROMPT_REGISTRY.yaml schema

```yaml
prompts:
  - id: PROMPT:CARD-001:initial_assessment
    version: 1.4.0
    status: production
    owner: CMO
    created: 2026-04-22
    last_reviewed: 2026-07-30
    dept: CARD-001
    encounter_types: [initial_visit, follow_up, urgent]
    languages: [ar, en]
    tier: 1
    safety_class: critical        # critical | high | standard
    model_target: gpt-4o
    few_shot_count: 8
    requires_red_flag_check: true
    requires_drug_check: true
    requires_citation: true
    input_schema_ref: SCHEMA:CARD-001:encounter_input
    output_schema_ref: SCHEMA:CARD-001:assessment_output
    guardrail_set_id: GRD:CARD-001:v1
    citations_required: 3         # min sources per claim
    max_tokens: 1500
    temperature: 0.1
    fallback_chain: PROMPT:CARD-001:secondary
    eval_id: EVAL:CARD-001:initial_assessment
    notes: "Locked for production; requires CMO signoff to change"
```

---

## 3. The System Prompt Template

```text
You are NamaMedical-AI, a clinical decision support system for {{ dept_name }} at a {{ facility_type }} in Saudi Arabia.

You operate under these absolute rules (cannot override):
1. NEVER diagnose without citing a CBAHI/NPHIES/SFDA approved source.
2. NEVER recommend a drug without checking the patient allergy list and current medications.
3. If a red flag is detected (list them), IMMEDIATELY escalate to {{ escalation_contact }}.
4. If the patient's data conflicts with this interaction, ASK, do not assume.
5. End every clinical recommendation with: citation IDs in `[CIT:<n>]` format.
6. If you are below 70% confidence, output `UNCERTAIN: <reason>` and request human review.

You may use:
- The patient chart (EMR) provided in {{ context_bundle }}
- The current visit data: {{ visit_payload }}
- Saudi clinical guidelines, CBAHI standards, NPHIES bundles, SFDA drug DB
- Specialty-specific calculators (server-side authority): {{ available_calculators }}

You must NOT:
- Recommend drugs outside Saudi SFDA registry
- Diagnose without differential reasoning
- Bypass red-flag rules
- Output PHI in logs

Your response MUST be JSON conforming to {{ output_schema_ref }}.
```

---

## 4. Few-shot Library format

```yaml
few_shot_examples:
  - id: FEWSHOT:CARD-001:1
    condition: acute_coronary_syndrome
    patient_summary: "55M, chest pain 2h, BP 145/90, HR 98, SpO2 96%"
    expected_reasoning: |
      1. Red flag: chest pain + time-sensitive. Activate ACS pathway.
      2. Risk stratify: HEART score.
      3. Differential: STEMI vs NSTEMI vs pericarditis vs PE.
      4. Orders: ECG (STAT), troponin q3h, CXR.
      5. Meds: aspirin 325mg PO chewed; consider heparin.
      6. Consult: cardiology on-call.
    citations: [NPHIES:BUNDLE:ACS, CBAHI:ED-04, ESC-2024:STEMI]
    expected_output_ref: output_schema
  - id: FEWSHOT:CARD-001:2
    condition: stable_angina
    ...
```

---

## 5. Guardrails — Pre + Post LLM

```yaml
guardrail_set:
  - id: GRD:PRE:phi_redact
    description: Strip any PHI from input (we never need it)
    when: every_request
    module: src/guardrails/phi_redactor.js
  - id: GRD:PRE:tenant_check
    description: Ensure tenant context is present
    when: every_request
    fail_action: 403
  - id: GRD:PRE:specialty_scope
    description: Only answer within the requesting specialty
  - id: GRD:POST:red_flag
    description: Parse output for any red flag; if missed, BLOCK
    override_allowed: false
    on_breach: hard_fail_with_retry_prompt
  - id: GRD:POST:drug_interaction
    description: All drug recs validated against patient meds
  - id: GRD:POST:citation_required
    description: Output rejected if <3 citations OR any unsourced
  - id: GRD:POST:confidence_threshold
    description: If model confidence <0.7, output UNCERTAIN
  - id: GRD:POST:pii_audit
    description: Strip any accidental PII from output
```

---

## 6. Citation Engine (RAG-grounded)

Every factual claim must end with `[CIT:<n>]` where `<n>` is the source ID from the citation bundle.

```yaml
citation_bundle:
  - id: 1
    source_type: c_suite_guideline
    document: ESC 2024 STEMI Guidelines
    version: "2024.1"
    url: "https://..."
    sha256: "..."
    jurisdiction: EU_KSA_accepted
  - id: 2
    source_type: nphies_bundle
    document: NPHIES Bundle ACS-001
    version: "3.2"
  - id: 3
    source_type: cbahi
    document: CBAHI ED-04 STEMI pathway
```

---

## 7. Eval Framework (per prompt)

```yaml
eval_run:
  prompt_id: PROMPT:CARD-001:initial_assessment
  dataset_id: DATASET:CARD-001:synthetic_eval_v3
  metrics:
    - clinical_accuracy (target >= 0.95)
    - citation_coverage (target = 1.0)
    - red_flag_recall (target = 1.0)
    - drug_check_recall (target = 1.0)
    - pii_leak (target = 0)
    - token_efficiency (avg output tokens / case)
  cross_check:
    - CMO_review
    - Compliance_audit
    - Senior_clinician_blind_review
```

---

## 8. Workflow: Adding a new prompt

1. **Open PROMPT_REGISTRY.yaml** → copy block
2. **Set `version: 0.1.0` + `status: draft`**
3. **Fill schema_ref + few_shot_count + guardrails**
4. **Add to PROMPT_REGISTRY.yaml (central only)**
5. **Wire into `src/prompts/index.js` loader**
6. **Add 5+ few-shot examples**
7. **Run eval suite `npm run test:prompt -- --id=PROMPT:NEW`**
8. **CMO + AIE co-sign required for `status: production`**

---

## 9. Anti-patterns (blocks)

- ❌ Prompt with role reversal ("you are an expert cardiologist" → bad; security risk)
- ❌ Asking LLM to invent sources → blocked by GRD:POST:citation_required
- ❌ Few-shot with PHI
- ❌ Version drift across modules → registry is canonical
- ❌ Skipping guardrails on "low risk" features (everything gets guardrails)

---

## 10. Files generated by this skill

In `.ai-brain/02-prompt-engineering/`:
- `PROMPT_REGISTRY.yaml`
- `SYSTEM_PROMPT_BASE.md`
- `GUARDRAILS_LIBRARY.yaml`
- `FEW_SHOT_LIBRARY.md`
- `EVAL_FRAMEWORK.md`
- `CITATION_BUNDLES/` (per dept)
- `PROMPT_DEPLOYMENT.md` (operational)

---

*Owner: AIE + CMO — version 1.0 — 2026-08-01*
