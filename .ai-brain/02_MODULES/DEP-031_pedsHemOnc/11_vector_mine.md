# VectorMine Configuration — Pediatric_HemOnc (DEP-031)

## Collections
| Name | Chunks | Embedding | Purpose |
|---|---|---|---|
| pedsHemOnc_guidelines | 10k | text-embedding-3-large | Clinical guidelines |
| pedsHemOnc_protocols | 2k | text-embedding-3-large | Internal protocols |
| pedsHemOnc_drugs | 5k | text-embedding-3-large | SFDA drug monographs |
| pedsHemOnc_icd10 | 1k | text-embedding-3-large | ICD-10 codes |
| pedsHemOnc_snomed | 2k | text-embedding-3-large | SNOMED-CT |
| pedsHemOnc_cases | 1k | text-embedding-3-large | Anonymized cases |

## Schema (pgvector)
```sql
CREATE TABLE pedsHemOnc_embeddings (
  id BIGSERIAL PRIMARY KEY,
  tenant_id BIGINT NOT NULL,
  collection TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_meta JSONB NOT NULL DEFAULT '{}',
  embedding vector(3072),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pedsHemOnc_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedsHemOnc_embeddings FORCE ROW LEVEL SECURITY;
```

## Ingestion
- Source: Uptodate-like guidelines, internal protocols, SFDA, ICD-10, SNOMED
- Frequency: monthly refresh + on-demand
- Cost: ~$15 one-time per dept

## Retrieval
- Strategy: MMR (k=8, fetch_k=20, lambda_mult=0.5)
- Re-rank: cross-encoder (ms-marco-MiniLM)