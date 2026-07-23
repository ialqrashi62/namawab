# PULM-001 — Vector Store

## Tier-1
1. copd_protocols_idx — 200
2. asthma_protocols_idx — 200
3. pe_protocols_idx — 100
4. pneumonia_idx — 150
5. ild_idx — 100

## Tier-2
6. lung_cancer_idx — 100
7. pleural_effusion_idx — 50
8. tb_protocols_idx — 50

## Schema
```sql
CREATE TABLE pulm_vector_index (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  module_id VARCHAR(20) DEFAULT 'PULM-001',
  index_name VARCHAR(100),
  chunk_id VARCHAR(100),
  chunk_text TEXT,
  embedding VECTOR(768),
  metadata JSONB
);
CREATE INDEX idx_pulm_vector_hnsw ON pulm_vector_index
  USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);
```
