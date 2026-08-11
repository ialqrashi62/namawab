# VectorMine Configuration — PACU (DEP-025)

## Collections
| Name | Chunks | Embedding | Purpose |
|---|---|---|---|
| pacu_guidelines | 10k | text-embedding-3-large | Clinical guidelines |
| pacu_protocols | 2k | text-embedding-3-large | Internal protocols |
| pacu_drugs | 5k | text-embedding-3-large | SFDA drug monographs |
| pacu_icd10 | 1k | text-embedding-3-large | ICD-10 codes |
| pacu_snomed | 2k | text-embedding-3-large | SNOMED-CT |
| pacu_cases | 1k | text-embedding-3-large | Anonymized cases |

## Schema (pgvector)
```sql
CREATE TABLE pacu_embeddings (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  collection TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_meta JSONB NOT NULL DEFAULT '{}',
  embedding vector(3072),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pacu_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacu_embeddings FORCE ROW LEVEL SECURITY;
```

## Ingestion
- Source: Uptodate-like guidelines, internal protocols, SFDA, ICD-10, SNOMED
- Frequency: monthly refresh + on-demand
- Cost: ~$15 one-time per dept

## Retrieval
- Strategy: MMR (k=8, fetch_k=20, lambda_mult=0.5)
- Re-rank: cross-encoder (ms-marco-MiniLM)