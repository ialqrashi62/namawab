# Family Medicine — LangChain-style Chain Spec

> **القسم:** `family-medicine`
> **التاريخ:** 2026-08-11
> **الـ Chain:** patient-summary

---

## الـ Chain: patient-summary

### الهدف
توليد ملخص شامل للمريض قبل الزيارة (history + current + recommendations).

### الـ Steps

```
1. retrieve_patient_history
   - input: { patient_id }
   - function: getPatientSummary(patient_id, tenant_id)
   - output: { demographics, conditions, medications, allergies, last_visits }

2. retrieve_relevant_guidelines
   - input: { conditions }
   - function: vectorSearch(conditions.join(" "), tenant_id, topK=5)
   - output: { chunks: [{ source, text, similarity }] }

3. build_prompt
   - input: { patient, guidelines, locale }
   - template: "بناءً على التاريخ: {{patient}}\nوالإرشادات: {{guidelines}}\nولّد ملخصاً..."
   - output: { prompt }

4. call_llm
   - input: { prompt, model: "gpt-4-turbo", max_tokens: 1000 }
   - function: callOpenAI(model, prompt, opts)
   - output: { content, tokens, cost }

5. extract_structured
   - input: { llm_output }
   - function: parseToJSON(llm_output)
   - output: { key_concerns, action_items, follow_ups }
```

### الـ Code

```js
const { Chain, runChain } = require('../00_SYSTEM/17_LANGCHAIN_TEMPLATE.js');
const engine = require('../engine.js');
const { callOpenAI } = require('../00_SYSTEM/01_AI_CO_PILOT_ENGINE.js');

const patientSummaryChain = Chain.rag({
  retriever: async (input) => {
    // 1. Get patient
    const patient = await service.getPatient({ id: input.patient_id, tenantId: input.tenant_id });
    // 2. Get relevant guidelines
    const conditions = patient.conditions || [];
    const chunks = await rag.retrieve({
      query: conditions.join(' '),
      tenantId: input.tenant_id,
      topK: 5,
    });
    return { patient, guidelines: rag.buildContext(chunks) };
  },
  promptTemplate: `
    Patient: {{patient}}
    Guidelines: {{guidelines}}

    Generate a structured summary:
    1. Key concerns (bullet list)
    2. Action items (numbered list)
    3. Follow-ups (with timeline)
  `,
  llm: callOpenAI,
});

const result = await runChain(
  patientSummaryChain,
  { patient_id: '...', tenant_id: '...' },
);
```

### الـ Failure Modes

- **OpenAI down** → Fallback to Claude → Fallback to Gemini → Fallback to Ollama
- **RAG returns nothing** → Skip guidelines, use patient data only
- **LLM returns malformed** → Re-try with stricter prompt
- **Timeout (>10s)** → Return cached summary from last visit

### الـ Cost (typical)

- Patient context: ~500 tokens
- RAG chunks: ~1000 tokens
- LLM output: ~800 tokens
- Total: ~2300 tokens × $0.01/1k = $0.023 per call

### الـ Observability

- Logged to `observability.llm_cost_events`
- Audit logged with trace_id
- Latency: 1-3 seconds typical
- Quality: physician rates 👍/👎 → improves prompt
