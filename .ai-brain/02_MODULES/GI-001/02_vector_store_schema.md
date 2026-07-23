# GI-001 — Vector Store

## Tier-1
1. gi_bleed_protocols_idx — 100
2. ibd_protocols_idx — 150
3. cirrhosis_protocols_idx — 200
4. hepatitis_protocols_idx — 100
5. pancreatitis_protocols_idx — 100

## Tier-2
6. gi_cancer_idx — 100
7. endoscopy_findings_idx — 200
8. ercp_protocols_idx — 50

## Schema
```sql
CREATE TABLE gi_vector_index (
  id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL,
  module_id VARCHAR(20) DEFAULT 'GI-001',
  index_name VARCHAR(100), chunk_id VARCHAR(100), chunk_text TEXT,
  embedding VECTOR(768), metadata JSONB
);
CREATE INDEX idx_gi_vector_hnsw ON gi_vector_index
  USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);
```
