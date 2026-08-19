# P0-3 BCMA — Vector Mine Strategy

## Embeddings Source

| Source | Embed Model | Chunk Size | Use |
|---|---|---|---|
| ISMP 5 Rights Guide | text-embedding-3-small | 500 | RAG for safety rules |
| SFDA Drug Database | text-embedding-3-small | 200 | Drug-drug interactions |
| MoH Saudi Guidelines | text-embedding-3-small | 600 | Local regulation |
| Internal MAR history | text-embedding-3-small | 300 | Similar case retrieval |

## Index

- pgvector with REAL[] arrays (per SQL page-resource)
- HNSW index on cosine distance
- Rerank using cross-encoder

## Retrieval Triggers

- New drug interaction query → vector search across SFDA + history
- Allergy not in list → fuzzy match via embeddings
- Override justification → retrieve similar prior overrides