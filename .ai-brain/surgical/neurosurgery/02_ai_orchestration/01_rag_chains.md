# RAG Chains — NS-NEURO (LangChain LCEL)

| Chain ID | Purpose | Retriever filter (PGVector) | Citation rule |
|---|---|---|---|
| NS-RAG-RISK | Explain aneurysm risk score rationale | specialty⊇{CBV}, doc_type∈{guideline,journal}, locale=ui | Every numeric claim must carry chunk ref |
| NS-RAG-TBI | TBI protocol guidance at triage | doc_type=guideline, icd_tags∋S06 | Protocol clause id mandatory |
| NS-RAG-EPI | Epilepsy surgery eligibility evidence | icd_tags∋G40 | ≥2 independent chunks for class-I claim |
| NS-RAG-CONSENT | Draft plain-language consent brief | doc_type∈{consent_template,policy}, locale=en/ar | Template version pinned |

```js
// LCEL pseudo-code (citation enforcement inside map step)
const chain = RunnableSequence.from([
  loadContext, retriever.asFiltered(filter), rerank(5),
  compressStuffs(4000),
  promptRegistry.get("NS-RISK-001"),
  llm.bind({ temperature: 0.2 }),
  enforceCitations   // throws CitationError if any sentence lacks [doc:chunk] marker
]);
```

Guardrails: tenant_id injected into every filter; refusal path returns "insufficient sourced evidence" instead of free generation.
