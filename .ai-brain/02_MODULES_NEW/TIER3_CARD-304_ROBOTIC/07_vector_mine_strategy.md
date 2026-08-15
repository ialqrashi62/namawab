# CARD-304_ROBOTIC — VectorMine Strategy

## Knowledge Corpus
- STS 2024 Cardiac Surgery
- ESC 2023 Valve Disease
- AHA/ACC 2024 Valve Management
- DaVinci Surgical Manuals
- TAVI Trial Data (PARTNER, CoreValve, Evolut Low Risk)
- MitraClip COAPT Trial
- WATCHMAN PROTECT-AF, PREVAIL
- ISHLT 2023 Mechanical Support
- Saudi MoH Cardiac Surgery Standards
- Saudi Cardiac Surgery Registry

## Chunking Strategy
- 512 tokens, 50-token overlap
- H1/H2/H3 preserved
- Metadata: source, year, topic, language

## Embedding
- OpenAI text-embedding-3-large (3072)
- BGE-M3 for AR

## Vector DB
- pgvector + HNSW (m=16, ef=64)
- Cosine + 30% BM25 hybrid

## Sample Queries
1. "TAVI eligibility for 80-year-old with severe AS?"
2. "STS risk for robotic mitral repair in 70-year-old?"
3. "MitraClip vs surgery for high-risk MR?"
4. "WATCHMAN post-implant anticoagulation?"
5. "Conversion to open during robotic surgery?"

## Targets
- Recall@10 ≥0.95
- MRR ≥0.85
- Citation accuracy ≥0.98
- Hallucination rate <2%
