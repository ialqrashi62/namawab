# CARD-302_ADHF — VectorMine Strategy

## Knowledge Corpus
- AHA/ACC/HFSA 2022 HF Guidelines
- ESC 2021 HF Guidelines
- ISHLT 2023 Transplant Consensus
- INTERMACS 2023 Manual
- Saudi MoH Cardiac Center Standards
- SCAI SHOCK 2022 Stages
- GDMT 4-Pillar Trials (PARADIGM-HF, EMPEROR-Reduced, DAPA-HF, VICTORIA)
- LVAD Trials (MOMENTUM 3, ENDURANCE)
- Saudi SCOT Transplant Protocols

## Chunking Strategy
- **PDFs**: 512 tokens with 50-token overlap
- **H1/H2/H3 boundaries preserved**
- **Metadata**:
  ```json
  {
    "source": "AHA_ACC_HFSA_2022",
    "section": "GDMT / 4-Pillar Therapy",
    "class_level": "Class I, Level A",
    "year": 2022,
    "language": "en",
    "topic": "gdmt",
    "page": 45
  }
  ```

## Embedding Model
- OpenAI `text-embedding-3-large` (3072 dims)
- BGE-M3 for Arabic
- Cohere multilingual for mixed

## Vector DB
- pgvector + HNSW (m=16, ef_construction=64)
- Cosine distance
- Hybrid: 70% vector + 30% BM25

## Index Strategy
- Partition: `topic` (gdmt, shock, lvad, transplant, scit)
- Partition: `language` (en, ar)
- Refresh: monthly + on guideline update

## Retrieval
- Top-10 → Rerank (BGE-reranker-v2) → Top-5
- Per-query latency P95: <200ms

## Sample Queries
1. "What is the target dose of Sacubitril/Valsartan?"
2. "SCAI stage for SBP 85, lactate 3?"
3. "INTERMACS profile for HF patient on home inotropes?"
4. "LVAD candidate with PVR 6 Wood Units — eligible?"
5. "Heart transplant listing criteria for Status 1A?"
6. "MAGGIC score components?"

## Performance Targets
- Recall@10 ≥ 0.95
- MRR ≥ 0.85
- Citation accuracy ≥ 0.98
- Hallucination rate < 2%

## Safety
- Refuse if no relevant chunk found
- Always cite source
- No PHI in queries
- Check citations for clinical decisiveness
