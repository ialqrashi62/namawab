# RAG (LangChain LCEL)
```js
const chain = retriever(pgvector,{oncology_cycles_guidelines}) |> formatDocs |> llm({citations:'required'})
```
Guardrail: answer MUST cite doc ids; else fallback 'refer to specialist'.
