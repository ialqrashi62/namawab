# CARD-301_STROKE — VectorMine Strategy

## Knowledge Corpus
- AHA/ASA Stroke Guidelines (2019, 2021, 2024)
- Saudi MoH Stroke Program protocols
- ESO (European Stroke Organization) guidelines
- WSО (World Stroke Organization) guidance
- Hospital-specific protocols
- Thrombolysis + Thrombectomy procedure manuals
- ICH management algorithms
- SAH aneurysm treatment protocols
- Secondary prevention bundles
- Patient education materials (AR/EN)

## Chunking Strategy
- **Document type**: PDF + DOCX
- **Chunk size**: 512 tokens with 50-token overlap
- **Section preservation**: respect H1/H2/H3 boundaries
- **Metadata schema**:
  ```json
  {
    "source": "AHA_ASA_2019_Acute_Ischemic_Stroke",
    "section": "IV Thrombolysis / Eligibility",
    "class_level": "Class I, Level A",
    "year": 2019,
    "language": "en",
    "topic": "thrombolysis_eligibility",
    "page": 12
  }
  ```

## Embedding Model
- OpenAI `text-embedding-3-large` (3072 dims)
- BGE-M3 backup for Arabic content
- Cohere embed-multilingual-v3 for mixed AR/EN

## Vector Database
- pgvector with HNSW index
- HNSW params: `m=16, ef_construction=64`
- Distance: cosine
- Hybrid search: 70% vector + 30% BM25 keyword

## Index Strategy
- Partition by `topic` (thrombolysis, thrombectomy, ich, sah, secondary_prev, rehab)
- Partition by `language` (en, ar)
- Refresh frequency: monthly + on guideline update

## Retrieval Strategy
- Top-10 initial retrieval
- Rerank with cross-encoder (BGE-reranker-v2-m3)
- Compress to top-5 with max 200 tokens each

## RAG Safety
- Always cite source + class/level
- Reject retrieval if no relevant chunk found
- Refuse to answer if no citation
- Log all retrievals for audit

## Update Process
- Weekly delta check (AHA/ASA/MoH RSS feeds)
- New guideline → ingest + chunk + verify
- Old guideline → archive (don't delete, keep with `is_archived` flag)

## Sample Queries (for validation)
1. "Is Tenecteplase safe in a patient with INR 1.9?"
2. "Door-to-needle target for AIS thrombolysis?"
3. "BP target for ICH with mass effect?"
4. "When to start anticoagulation after ischemic stroke with AFib?"
5. "Secondary prevention after TIA with 50% carotid stenosis?"

## Performance Targets
- Retrieval latency P95: <200ms
- Recall@10: ≥0.95
- MRR: ≥0.85
- Citation accuracy: ≥0.98
