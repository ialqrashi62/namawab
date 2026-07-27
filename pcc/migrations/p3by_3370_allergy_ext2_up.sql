-- P3-BY module schema for allergy_ext2 v3.37.0
CREATE TABLE IF NOT EXISTS p3by_allergy_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3by_allergy_ext2_tenant ON p3by_allergy_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3by_allergy_ext2_encounter ON p3by_allergy_ext2(encounter_id);
