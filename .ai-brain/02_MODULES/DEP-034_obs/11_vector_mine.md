# VectorMine Configuration — Obstetrics (DEP-034)

## Collections
| Name | Chunks | Embedding | Purpose |
|---|---|---|---|
| obs_guidelines | 10k | text-embedding-3-large | Clinical guidelines |
| obs_protocols | 2k | text-embedding-3-large | Internal protocols |
| obs_drugs | 5k | text-embedding-3-large | SFDA drug monographs |
| obs_icd10 | 1k | text-embedding-3-large | ICD-10 codes |
| obs_snomed | 2k | text-embedding-3-large | SNOMED-CT |
| obs_cases | 1k | text-embedding-3-large | Anonymized cases |

## Schema (pgvector)
```sql
CREATE TABLE obs_embeddings (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  collection TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_meta JSONB NOT NULL DEFAULT '{}',
  embedding vector(3072),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE obs_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE obs_embeddings FORCE ROW LEVEL SECURITY;
```

## Ingestion
- Source: Uptodate-like guidelines, internal protocols, SFDA, ICD-10, SNOMED
- Frequency: monthly refresh + on-demand
- Cost: ~$15 one-time per dept

## Retrieval
- Strategy: MMR (k=8, fetch_k=20, lambda_mult=0.5)
- Re-rank: cross-encoder (ms-marco-MiniLM)