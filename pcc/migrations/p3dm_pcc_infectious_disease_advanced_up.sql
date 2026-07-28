-- P3-DM module schema for pcc_infectious_disease_advanced v3.77.0
CREATE TABLE IF NOT EXISTS p3dm_pcc_infectious_disease_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dm_pcc_infectious_disease_advanced_tenant ON p3dm_pcc_infectious_disease_advanced(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dm_pcc_infectious_disease_advanced_encounter ON p3dm_pcc_infectious_disease_advanced(encounter_id);
