# PEDS-002 — Vector Store Schema (PGVector)

## Tier-1 Indexes
1. **neonatal_protocols_idx** — 200 protocols (preterm care, RDS, sepsis, NEC)
2. **drug_dosing_peds_idx** — 300 weight-based drug doses
3. **respiratory_support_idx** — 100 vent/CPAP/HFOV protocols

## Tier-2 Indexes
4. **rop_screening_idx** — 50 ROP screening guidelines
5. **enteral_feeding_idx** — 100 feeding protocols
6. **developmental_milestones_idx** — 50 developmental checks

## Schema
```sql
CREATE TABLE peds_nicu_vector_index (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  module_id VARCHAR(20) DEFAULT 'PEDS-002',
  index_name VARCHAR(100),
  chunk_id VARCHAR(100),
  chunk_text TEXT,
  embedding VECTOR(768),
  metadata JSONB
);

CREATE INDEX idx_peds_nicu_vector_hnsw ON peds_nicu_vector_index
  USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);

ALTER TABLE peds_nicu_vector_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_nicu_vector_index FORCE ROW LEVEL SECURITY;
```
