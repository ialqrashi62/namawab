# VectorMine Configuration — Endocrinology (DEP-002)

## Collections
| Name | Chunks | Embedding | Purpose |
|---|---|---|---|
| endocrinology_guidelines | 10k | text-embedding-3-large | Clinical guidelines |
| endocrinology_protocols | 2k | text-embedding-3-large | Internal protocols |
| endocrinology_drugs | 5k | text-embedding-3-large | SFDA drug monographs |
| endocrinology_icd10 | 1k | text-embedding-3-large | ICD-10 codes |
| endocrinology_snomed | 2k | text-embedding-3-large | SNOMED-CT |
| endocrinology_cases | 1k | text-embedding-3-large | Anonymized cases |

## Schema (pgvector)
```sql
CREATE TABLE endocrinology_embeddings (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  collection TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_meta JSONB NOT NULL DEFAULT '{}',
  embedding vector(3072),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE endocrinology_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE endocrinology_embeddings FORCE ROW LEVEL SECURITY;
```

## Ingestion
- Source: Uptodate-like guidelines, internal protocols, SFDA, ICD-10, SNOMED
- Frequency: monthly refresh + on-demand
- Cost: ~$15 one-time per dept

## Retrieval
- Strategy: MMR (k=8, fetch_k=20, lambda_mult=0.5)
- Re-rank: cross-encoder (ms-marco-MiniLM)