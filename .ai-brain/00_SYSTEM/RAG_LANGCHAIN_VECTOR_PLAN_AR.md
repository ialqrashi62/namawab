# RAG + LANGCHAIN + VECTOR DB PLAN
**Last updated:** 2026-08-10

---

## 1. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  USER QUERY                                                  │
│  "What are the side effects of metformin in CKD patients?"  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  LANGCHAIN ORCHESTRATION                                     │
│  1. Preprocess query (lang, format, expand)                  │
│  2. Embed query (text-embedding-3-large, 3072d)              │
│  3. Vector search (pgvector, top-k=10, HNSW)                │
│  4. Rerank (Cohere Rerank or cross-encoder)                  │
│  5. Compress (LLMLingua, 50% reduction)                      │
│  6. Augment prompt with top-5 docs                            │
│  7. LLM generate (gpt-4o / claude-3-5-sonnet)                │
│  8. Cite sources                                              │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  RESPONSE                                                    │
│  - Answer                                                    │
│  - Sources (chunk_id, doc_title, url)                        │
│  - Confidence                                                │
│  - Latency                                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Components

### 2.1 Embedding model

- **text-embedding-3-large** (OpenAI) — 3072d · $0.13/1M tokens
- **cohere-embed-english-v3.0** (Cohere) — 1024d · $0.10/1M tokens
- **mxbai-embed-large-v1** (local, HuggingFace) — 1024d · free · for sensitive data

Decision:
- Sensitive PHI → local mxbai
- Public docs (SOPs, drug labels) → OpenAI
- Multilingual → Cohere

### 2.2 Vector DB

- **pgvector** (Postgres extension)
- HNSW index (faster than IVFFlat for large datasets)
- Cosine similarity
- Tables:
  - `vector_chunks` — chunk_id, doc_id, embedding (3072d or 1024d), content, metadata
  - `vector_documents` — doc_id, title, source, version, tenant_id (null for global), created_at

### 2.3 Reranker

- **Cohere Rerank 3.5** — top-k reduction
- **bge-reranker-v2-m3** (local, HuggingFace) — for sensitive data

### 2.4 Compressor

- **LLMLingua** — 50% token reduction while preserving meaning
- Optional, only for long-context queries

### 2.5 LLM

- **gpt-4o** — primary, complex reasoning
- **gpt-4o-mini** — fast + cheap for simple Q&A
- **claude-3-5-sonnet** — for clinical writing + reasoning
- **local Llama 3.1 70B** — for sensitive data (SOPs, internal docs)

---

## 3. Document ingestion

### Sources

| Source | Type | Frequency |
|---|---|---|
| Drug formulary | Saudi FDA + WHO | Quarterly |
| Clinical SOPs | Internal | On-update |
| WHO guidelines | Public | On-publish |
| Saudi MOH protocols | Public | On-publish |
| Patient education | Curated | Quarterly |
| ICD-10 / SNOMED CT | Reference | Annual |
| Hospital policies | Internal | On-update |
| Department manuals | Internal | On-update |

### Pipeline

```python
# 1. Fetch source (RSS, API, manual upload)
# 2. Extract text (PDF, HTML, DOCX)
# 3. Chunk (1000 chars, 200 overlap)
# 4. Embed (per-tenant or global)
# 5. Upsert to pgvector
# 6. Track in vector_documents
```

### Chunking strategy

- **Recursive text splitter** (LangChain)
- Chunk size: 1000 chars
- Overlap: 200 chars
- Metadata: source, section, page, version, language, specialty

---

## 4. Use cases

### 4.1 Clinical Q&A

Doctor asks: "What's the first-line treatment for hypertension in a diabetic patient with CKD stage 3?"

RAG returns:
- 3 guideline excerpts (Saudi MOH, WHO)
- 2 hospital SOP excerpts
- 2 drug formulary entries
- 1 recent journal article

LLM composes answer with citations.

### 4.2 Drug-interaction check (semantic)

Pharmacist asks: "Is there any interaction between these 5 meds: ... ?"

RAG searches:
- Drug-interaction database
- Saudi FDA alerts
- Hospital SOPs

LLM returns ranked interactions.

### 4.3 SOP lookup

Nurse asks: "How do I document a pressure ulcer assessment?"

RAG returns:
- Hospital SOP
- WHO wound care guideline
- NDNQI pressure ulcer staging guide

### 4.4 Patient education

Patient asks: "What should I expect after my surgery?"

RAG returns:
- Procedure-specific patient education
- Hospital discharge SOP
- WHO general recovery guidelines

### 4.5 Coding / CDI

Coder asks: "What's the ICD-10 code for sepsis with septic shock?"

RAG returns:
- ICD-10 lookup
- Saudi coding guidelines
- WHO ICD-10 2024

---

## 5. LangChain orchestration

### Chains

```python
# 5.1 Q&A chain (default)
chain_qa = (
    preprocess_query
    | embed_query
    | vector_search(top_k=10)
    | rerank(top_k=5)
    | compress
    | augment_prompt
    | llm_generate
    | cite_sources
)

# 5.2 Multi-doc synthesis
chain_synthesis = (
    preprocess_query
    | embed_query
    | vector_search(top_k=20)
    | group_by_source
    | per_group_summarize
    | merge_summaries
    | llm_synthesize
    | cite_sources
)

# 5.3 Conversational RAG
chain_conversational = (
    load_history
    | rewrite_query_with_context
    | chain_qa
    | update_history
    | return_response
)

# 5.4 Agent (tool calling)
agent = create_openai_functions_agent(
    llm=gpt4o,
    tools=[
        vector_search_tool,
        drug_interaction_tool,
        sop_lookup_tool,
        patient_lookup_tool,
        appointment_lookup_tool,
    ],
    system_prompt=clinical_agent_system_prompt,
)
```

### Agents

- **Clinical Q&A agent** — answer clinical questions with citations
- **Coding agent** — ICD-10 / CPT lookup
- **Workflow agent** — multi-step clinical workflows (e.g., "schedule a cardiology follow-up for patient X")
- **Triage agent** — pre-triage patient symptoms
- **Documentation agent** — auto-draft clinical note from voice

---

## 6. RAG API surface

```python
POST /api/rag/query
  Body: { query: str, specialty: str, top_k: int }
  Response: { answer: str, sources: [...], confidence: float, latency_ms: int }

POST /api/rag/ingest
  Body: { document: ..., metadata: {...} }
  Response: { chunk_count: int, doc_id: int }

GET /api/rag/documents
  Response: [{ doc_id, title, source, version, chunk_count, created_at }]

DELETE /api/rag/documents/:id
  Response: { deleted_chunks: int }
```

---

## 7. Performance targets

| Metric | Target |
|---|---|
| Query latency p95 | < 3s |
| Query latency p99 | < 5s |
| Embedding throughput | 1000 chunks/min |
| Recall@5 | > 80% |
| Precision@5 | > 70% |
| Cost per query | < $0.05 |

---

## 8. Evaluation

### Offline eval

- 500 question-answer pairs (curated)
- Metrics: recall, precision, MRR, nDCG
- LLM-as-judge for answer quality
- Human eval on 50 random samples per month

### Online eval

- Thumbs up/down on answers (in UI)
- Track abandoned queries
- A/B test reranker models

---

## 9. Multi-tenant considerations

- **Tenant isolation** — each tenant's documents are isolated
- **Global documents** — WHO/MOH/SFDA shared across tenants (read-only)
- **Per-tenant fine-tuning** — embeddings re-computed per tenant's vocabulary
- **Cost allocation** — per-tenant vector storage and query budget

---

## 10. Roadmap

| Quarter | Milestone |
|---|---|
| Q3 2026 | Clinical Q&A agent (single-doc) |
| Q4 2026 | Multi-doc synthesis + SOP lookup + drug interaction |
| Q1 2027 | Conversational RAG + memory + agent tool calling |
| Q2 2027 | Coding agent + workflow agent + documentation agent |

---

End of RAG + LangChain plan.
