# SURG-001 — RAG Chains

```yaml
chain: RAG:SURG-001:initial_assessment
retriever:
  - vector: ai_content_embeddings (pgvector, multilingual-e5-large)
  - bm25: postgres FTS (arabic)
  - kg: terminology_index
corpus_filter:
  - cba
  - nphies
  - sfda
  - journal_surg_001
  - local_protocol
top_k: 8
reranker: cross-encoder (ms-marco-MiniLM)
citation_required: 3
patient_graph_used: true
tenant_isolation: enforced
```

## Output

```json
{
  "answer": "...[CIT:1][CIT:2][CIT:3]",
  "citations": [...],
  "audit_id": "...",
  "token_usage": {...}
}
```

---

*Owner: AIE — 2026-08-01*
