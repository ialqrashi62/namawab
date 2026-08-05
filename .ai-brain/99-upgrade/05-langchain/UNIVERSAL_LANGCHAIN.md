---
id: UNIVERSAL-LANGCHAIN
version: 1.0
date: 2026-08-01
owner: AIE
status: ACTIVE
---

# UniversalLangChain — Per-dept LLM Chain Registry

> **Purpose:** One chain file per dept, instantiated from a base class. Composable + testable + auditable.

---

## 1. Why this approach

| System | Pattern |
|--------|---------|
| **DAX** | composer (audio → transcript → entities → note) |
| **Cerner CDA** | suggester chain (query → RAG → post-check) |
| **AWS HealthScribe** | primitive + builders |
| **Vertex AI Search** | retriever → ranker → answer |
| **NamaMedical ULC** | **composable** — chain = function composition with mandatory guardrails |

---

## 2. The base class

```ts
// src/langchain/UniversalChain.ts
export abstract class UniversalChain<I, O> {
  abstract id: string;
  abstract version: string;
  abstract deptId: string;
  abstract safetyClass: 'critical'|'high'|'standard';

  // Override these
  abstract protected prepInput(req: ChainRequest): Promise<I>;
  abstract protected buildLLM(input: I): Promise<LLMCall>;
  abstract protected parseOutput(raw: LLMResult): Promise<O>;

  // Shared, mandatory
  protected async preGuardrails(req: ChainRequest): Promise<void> {
    await this.runGuardrail('phi_redact', req);
    await this.runGuardrail('tenant_check', req);
    await this.runGuardrail('specialty_scope', req);
  }

  protected async postGuardrails(output: O): Promise<O> {
    let out = await this.runGuardrail('red_flag', output);
    out = await this.runGuardrail('drug_interaction', out);
    out = await this.runGuardrail('citation_required', out);
    out = await this.runGuardrail('confidence_threshold', out);
    out = await this.runGuardrail('pii_audit', out);
    return out;
  }

  async invoke(req: ChainRequest): Promise<ChainResponse<O>> {
    const start = Date.now();
    await this.preGuardrails(req);
    const input = await this.prepInput(req);
    const llm = await this.buildLLM(input);
    const raw = await llm.invoke();
    const parsed = await this.parseOutput(raw);
    const safe = await this.postGuardrails(parsed);
    const auditId = await this.audit(req, safe, Date.now() - start);
    return { output: safe, auditId, metadata: llm.metadata };
  }
}
```

---

## 3. Per-dept chains (initial catalog)

```yaml
chains:
  - id: CHAIN:CARD-001:initial_assessment
    base: UniversalChain
    dept: CARD-001
    safety_class: critical
    input_schema: SCHEMA:CARD-001:encounter_input
    output_schema: SCHEMA:CARD-001:assessment_output
    steps:
      - id: prep_input
        uses: src/chains/cardiology/prep.js
      - id: hybrid_retrieve
        retriever: vector+bm25+kg
        top_k: 8
        token_budget: 1500
      - id: llm_call
        model: gpt-4o
        prompt_id: PROMPT:CARD-001:initial_assessment
        max_tokens: 1500
        temperature: 0.1
      - id: parse_json
        schema: SCHEMA:CARD-001:assessment_output
        on_fail: retry_once
      - id: post_guardrails
        set: GRD:CARD-001:v1
    eval: EVAL:CARD-001:initial_assessment
  - id: CHAIN:ER-001:triage_esi
    ...
  - id: CHAIN:ICU-001:ews_sofa
    ...
  - id: CHAIN:PEDS-001:well_child
    ...
  # + 13 dept × 3 chain patterns = 39 chains
```

---

## 4. GuardrailChain (pre + post)

```ts
// src/langchain/GuardrailChain.ts
export class GuardrailChain<I> extends UniversalChain<I, I> {
  // Forwards I unchanged but ensures all guardrails run
  async invoke(req: ChainRequest<ChainResponse<I>, ChainResponse<I>>): ... {
    // Re-entry in inner chain
  }
}
```

**Pre-guardrails**: PHI redact, tenant check, specialty scope, language detect, profanity check, prompt injection detect (regex + heuristics)

**Post-guardrails**: Red flag, drug interaction, citation required, confidence threshold, PII audit, SFDA check

---

## 5. Multi-modal Chain (text + image + audio)

```ts
// src/langchain/MultiModalChain.ts
export class MultiModalChain<I extends {text: string; imageUrls?: string[]; audioUrl?: string}, O> {
  steps:
    - audio → whisper-large-v3 → transcript
    - image_urls → gpt-4o-vision → vision_features
    - text + transcript + vision → main LLM → output
}
```

Used for: wound photo + voice description (derm); radiology image + clinical notes; path slide + clinical context.

---

## 6. Files

```
src/langchain/
├── UniversalChain.ts
├── GuardrailChain.ts
├── MultiModalChain.ts
├── ChainRegistry.ts
├── evaluators/
│   ├── ClinicalSafetyEvaluator.ts
│   ├── CitationEvaluator.ts
│   └── HallucinationEvaluator.ts
├── chains/
│   ├── card/initial_assessment.ts
│   ├── er/triage.ts
│   ├── icu/ews.ts
│   └── peds/well_child.ts
└── tests/
```

---

## 7. Eval Pipeline

```yaml
eval_pipeline:
  dataset: per-dept synthetic (250 cases)
  metrics:
    clinical_accuracy: target >= 0.95
    citation_coverage: target = 1.0
    red_flag_recall: target = 1.0
    drug_check_recall: target = 1.0
    hallucination_rate: target < 0.05
    cost_per_call_usd: track
    latency_p95_ms: track
    pii_leak_count: target = 0
  cross_check:
    - CMO blind review
    - Senior clinician review
    - Compliance review
  on_failure:
    - block production release
    - page: prompt engineer + dept owner
```

---

*Owner: AIE — version 1.0 — 2026-08-01*
