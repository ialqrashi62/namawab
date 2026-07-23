# SURG-001 — Vector Store Schema (PGVector)

## Tier-1 Indexes
1. **surgical_procedures_idx** — 300 procedures (step-by-step)
2. **acute_abdomen_idx** — 100 acute abdomen algorithms
3. **trauma_protocols_idx** — 100 trauma management

## Tier-2 Indexes
4. **wound_care_idx** — 50 wound care protocols
5. **post_op_idx** — 100 post-op complications
6. **anesthesia_idx** — 100 anesthesia plans

## Schema
```sql
CREATE TABLE surg_vector_index (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  module_id VARCHAR(20) DEFAULT 'SURG-001',
  index_name VARCHAR(100),
  chunk_id VARCHAR(100),
  chunk_text TEXT,
  embedding VECTOR(768),
  metadata JSONB
);

CREATE INDEX idx_surg_vector_hnsw ON surg_vector_index
  USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);

ALTER TABLE surg_vector_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_vector_index FORCE ROW LEVEL SECURITY;
```
