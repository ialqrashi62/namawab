# CARD-001 — Vector Store Schema (PGVector)

## Tier-1 Indexes
1. **ecg_interpretation_idx** — 300 ECG patterns (STEMI, AF, VT, etc.)
2. **acs_protocols_idx** — 200 ACS protocols
3. **heart_failure_idx** — 150 HF management
4. **afib_protocols_idx** — 100 AF management

## Tier-2 Indexes
5. **echo_findings_idx** — 200 echo patterns
6. **valvular_disease_idx** — 100 valvular
7. **cardiomyopathy_idx** — 80 cardiomyopathy
8. **anticoagulation_idx** — 100 anticoagulation

## Schema
```sql
CREATE TABLE card_vector_index (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  module_id VARCHAR(20) DEFAULT 'CARD-001',
  index_name VARCHAR(100),
  chunk_id VARCHAR(100),
  chunk_text TEXT,
  embedding VECTOR(768),
  metadata JSONB
);

CREATE INDEX idx_card_vector_hnsw ON card_vector_index
  USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);

ALTER TABLE card_vector_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_vector_index FORCE ROW LEVEL SECURITY;
```
