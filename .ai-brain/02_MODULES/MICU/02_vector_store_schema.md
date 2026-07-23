# MICU — Vector Store Schema (PGVector)

## Tier-1 Indexes (high priority)
1. **critical_care_scenarios_idx**
   - 500 ICU scenarios: shock, respiratory failure, sepsis
   - Embedding: MedEmbed 768d
   - Metadata: severity, APACHE II, mortality, evidence

2. **ventilator_protocols_idx**
   - 100 ventilator protocols: ARDSNet, weaning, NIV
   - Metadata: P/F ratio, PEEP, FiO2

3. **vasoactive_drugs_idx**
   - 50 vasoactive drips: dose, indication, titration
   - Metadata: drug name, dose range, monitor

## Tier-2 Indexes
4. **critical_labs_idx** — 200 critical lab interpretations
5. **sepsis_bundle_idx** — hour-1, hour-3, hour-6 bundles
6. **ards_management_idx** — severity, positioning, paralysis

## Tier-3 Indexes
7. **crrt_protocols_idx** — RRT indications, modalities, dosing
8. **toxicology_idx** — drug overdose antidotes, dialysis
9. **icu_procedures_idx** — central line, arterial line, intubation
10. **delirium_idx** — prevention, treatment, restraints

## Schema
```sql
CREATE TABLE icu_vector_index (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  module_id VARCHAR(20) DEFAULT 'MICU',
  index_name VARCHAR(100),
  chunk_id VARCHAR(100),
  chunk_text TEXT,
  embedding VECTOR(768),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX icu_vector_hnsw ON icu_vector_index
  USING hnsw (embedding vector_cosine_ops)
  WITH (m=16, ef_construction=64);

ALTER TABLE icu_vector_index ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_vector_index FORCE ROW LEVEL SECURITY;
```
