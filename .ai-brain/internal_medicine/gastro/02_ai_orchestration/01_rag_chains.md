# RAG (LangChain LCEL)
```js
const chain = retriever(pgvector,{gastro_procedures_guidelines}) |> formatDocs |> llm({citations:'required'})
```
Guardrail: answer MUST cite doc ids; else fallback 'refer to specialist'.
