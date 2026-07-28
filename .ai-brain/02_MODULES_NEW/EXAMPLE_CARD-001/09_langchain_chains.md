# 09 — LangChain Chains (CARD-001)

> Owner: AIE · Snippet: snippet:langchain-rag · Tier 1

## chain-1: Cardiology Q&A (RetrievalQA)

```yaml
- id: cardio_qa_v1
  purpose: Answer cardiology clinical questions with guideline citations
  inputs: [question: str, patient_ctx: dict, encounter_id: uuid]
  outputs: { answer_ar, source, evidence_level, warnings, cds_rules, red_flag }
  steps:
    - { type: retriever, index: nm_cardio_guidelines_v1, top_k: 5, filter: { tenant_id, lang } }
    - { type: reranker, model: bge-reranker-large, top_k: 3 }
    - { type: context_compressor, max_tokens: 2500 }
    - { type: llm, model: gpt-4o, temperature: 0.1, max_tokens: 1000, system: <from 06> }
    - { type: parser, schema: pydantic.CardioQAResponse }
  observability: langfuse
  cost_per_call_usd: 0.012
```

## chain-2: ECG interpretation

```yaml
- id: ecg_interpret_v1
  purpose: Structured interpretation of 12-lead ECG
  inputs: [ecg_id: uuid, age, sex, symptoms, comorbidity]
  outputs: { rhythm, rate, intervals, axis, st_changes, q_waves, impression, urgency, red_flag }
  steps:
    - { type: retriever, index: nm_cardio_ecg_patterns_v1, top_k: 3 }
    - { type: llm, model: gpt-4o-vision (or vision-tuned), system: <ecg_interpret_persona> }
    - { type: parser, schema: pydantic.ECGReport }
  observability: langfuse + custom metrics
  cost_per_call_usd: 0.025
  critical: true  # red-flag detection required
```

## chain-3: HF GDMT optimization

```yaml
- id: hf_gdmt_v1
  purpose: Recommend GDMT optimization for HF patient
  inputs: [patient_id, ef, nyha, bp, hr, egfr, k, current_meds]
  outputs: { recommended_changes, contraindications, monitoring_plan, follow_up }
  steps:
    - { type: tool, name: lookup_active_medications }
    - { type: tool, name: lookup_recent_labs, days: 30 }
    - { type: cds_check, rules: [CDS-HF-GDMT, CDS-HF-HYPERKALEMIA, CDS-HF-DIURETIC-DOSE] }
    - { type: llm, model: gpt-4o, system: <hf_persona> }
    - { type: parser, schema: pydantic.HFGDMTPlan }
  observability: langfuse
  critical: true  # drug change
```

## chain-4: Pre-op cardiac clearance

```yaml
- id: preop_cardiac_v1
  purpose: Generate preop cardiac clearance letter
  inputs: [patient_id, surgery_type, urgency, functional_capacity_mets, comorbidities]
  outputs: { risk_score, recommendations, clearance_level, red_flag }
  steps:
    - { type: tool, name: lookup_encounter }
    - { type: tool, name: lookup_recent_labs, days: 30 }
    - { type: cds_check, rules: [CDS-PREOP-RCRI, CDS-PREOP-ANTICOAG-HOLD] }
    - { type: llm, model: gpt-4o, system: <preop_cardiac_persona> }
    - { type: parser, schema: pydantic.PreopClearanceLetter }
  observability: langfuse
```

## chain-5: AF anticoagulation decision

```yaml
- id: af_anticoag_v1
  purpose: Recommend anticoagulation for AF patient
  inputs: [patient_id, age, sex, cha2ds2vasc, hasbled, crcl, current_meds, bleed_history]
  outputs: { indication, drug, dose, duration, monitoring, red_flag }
  steps:
    - { type: tool, name: lookup_active_medications }
    - { type: cds_check, rules: [CDS-AF-STROKE-RISK, CDS-AF-BLEED-RISK, CDS-AF-DOAC-DOSE] }
    - { type: llm, model: gpt-4o, system: <af_anticoag_persona> }
    - { type: parser, schema: pydantic.AnticoagPlan }
  observability: langfuse
  critical: true
```

## chain-6: Chest pain triage support

```yaml
- id: chest_pain_triage_v1
  purpose: Support ED triage with HEART score + risk strat
  inputs: [age, history, ecg_findings, age, risk_factors, troponin]
  outputs: { heart_score, risk_level, recommended_disposition, red_flag }
  steps:
    - { type: cds_check, rules: [CDS-CHEST-PAIN-HEART] }
    - { type: llm, model: gpt-4o, system: <chest_pain_persona> }
    - { type: parser, schema: pydantic.ChestPainTriage }
  observability: langfuse
  critical: true
```
