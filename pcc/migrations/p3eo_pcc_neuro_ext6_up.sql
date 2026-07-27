-- P3-EO module schema for pcc_neuro_ext6 v3.105.0
CREATE TABLE IF NOT EXISTS p3eo_pcc_neuro_ext6 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3eo_pcc_neuro_ext6_tenant ON p3eo_pcc_neuro_ext6(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3eo_pcc_neuro_ext6_encounter ON p3eo_pcc_neuro_ext6(encounter_id);
