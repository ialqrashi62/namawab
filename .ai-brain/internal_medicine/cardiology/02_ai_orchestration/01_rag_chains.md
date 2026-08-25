# RAG (LangChain LCEL)
```js
const chain = retriever(pgvector,{cardiology_assessments_guidelines}) |> formatDocs |> llm({citations:'required'})
```
Guardrail: answer MUST cite doc ids; else fallback 'refer to specialist'.
