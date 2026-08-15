# CARD-303_ONCO — VectorMine Strategy

## Knowledge Corpus
- ESC 2022 Cardio-Onc Guidelines
- AHA/ACC 2023 Cardio-Onc Statement
- IC-OS 2024 ICI Myocarditis
- ASCO 2020 Cardioprotection
- NCCN 2024 VTE in Cancer
- HFA-ICOS 2022 Risk Score
- Saudi MoH Cancer Center Standards
- Saudi Cancer Registry
- NHLBI Cardiotoxicity Mechanisms
- Trastuzumab Cardiac Trials
- Anthracycline Cardiotoxicity Registries

## Chunking Strategy
- 512 tokens, 50-token overlap
- H1/H2/H3 preserved
- Metadata: source, section, year, language, topic

## Embedding
- OpenAI text-embedding-3-large (3072)
- BGE-M3 for AR
- Cohere multilingual

## Vector DB
- pgvector + HNSW (m=16, ef=64)
- Cosine + 30% BM25 hybrid

## Index
- Partition: topic (cardiotoxicity, ici, vte, htn, qt, amyloid, cardioprotection)
- Refresh: monthly + guideline update

## Retrieval
- Top-10 → Rerank → Top-5
- P95 <200ms

## Sample Queries
1. "Anthracycline cumulative dose for high-risk patient?"
2. "ICI myocarditis treatment per IC-OS?"
3. "DOAC vs LMWH for cancer VTE?"
4. "Trastuzumab EF drop threshold?"
5. "Cardioprotection for high-risk patient?"
6. "Cardiac amyloid workup?"

## Targets
- Recall@10 ≥0.95
- MRR ≥0.85
- Citation accuracy ≥0.98
- Hallucination rate <2%
