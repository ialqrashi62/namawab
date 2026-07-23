# GI-001 — Stitch + Wireframes + Vector

## Stitch Layout — Endoscopy Suite
```
Endoscopy Board:
- Room 1: EGD scheduled 09:00
- Room 2: Colonoscopy scheduled 10:00
- Room 3: ERCP scheduled 11:00
```

## Wireframes (5)
- Endoscopy schedule
- EGD report
- Colonoscopy report
- Liver scores
- Bleed assessment

## Vector Indexes
1. gi_bleed_protocols_idx
2. ibd_protocols_idx
3. cirrhosis_protocols_idx
4. hepatitis_protocols_idx
5. pancreatitis_protocols_idx
6. gi_cancer_idx
7. endoscopy_findings_idx
8. ercp_protocols_idx

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
