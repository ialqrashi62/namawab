# OBG-001 — Vector Store Schema (PGVector)

## Tier-1 Indexes
1. **prenatal_protocols_idx** — 200 chunks
   - First trimester screen, anomaly scan, GDM, preeclampsia
2. **labor_management_idx** — 150 chunks
   - Stages of labor, FHR patterns, operative delivery
3. **pph_protocols_idx** — 100 chunks
   - HAEMOSTASIS algorithm, B-Lynch, hysterectomy
4. **gyn_protocols_idx** — 300 chunks
   - Common gyn conditions, contraception, menopause

## Tier-2 Indexes
5. **gyn_oncology_idx** — 50 chunks
6. **infertility_idx** — 100 chunks
7. **ultrasound_findings_idx** — 100 chunks

## Schema
```sql
CREATE TABLE obg_vector_index (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  module_id VARCHAR(20) DEFAULT 'OBG-001',
  index_name VARCHAR(100),
  chunk_id VARCHAR(100),
  chunk_text TEXT,
  embedding VECTOR(768),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_obg_vector_hnsw ON obg_vector_index
  USING hnsw (embedding vector_cosine_ops)
  WITH (m=16, ef_construction=64);

ALTER TABLE obg_vector_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE obg_vector_index FORCE ROW LEVEL SECURITY;
```

## Indexing Strategy
- All clinical protocols (English, source-cited)
- Brand-name + generic-name drug
- ICD-10 codes embedded
- Procedures, surgeries
