# VectorMine Configuration — Transplant_Surgery (DEP-020)

## Collections
| Name | Chunks | Embedding | Purpose |
|---|---|---|---|
| transplant_guidelines | 10k | text-embedding-3-large | Clinical guidelines |
| transplant_protocols | 2k | text-embedding-3-large | Internal protocols |
| transplant_drugs | 5k | text-embedding-3-large | SFDA drug monographs |
| transplant_icd10 | 1k | text-embedding-3-large | ICD-10 codes |
| transplant_snomed | 2k | text-embedding-3-large | SNOMED-CT |
| transplant_cases | 1k | text-embedding-3-large | Anonymized cases |

## Schema (pgvector)
```sql
CREATE TABLE transplant_embeddings (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  collection TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_meta JSONB NOT NULL DEFAULT '{}',
  embedding vector(3072),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE transplant_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transplant_embeddings FORCE ROW LEVEL SECURITY;
```

## Ingestion
- Source: Uptodate-like guidelines, internal protocols, SFDA, ICD-10, SNOMED
- Frequency: monthly refresh + on-demand
- Cost: ~$15 one-time per dept

## Retrieval
- Strategy: MMR (k=8, fetch_k=20, lambda_mult=0.5)
- Re-rank: cross-encoder (ms-marco-MiniLM)