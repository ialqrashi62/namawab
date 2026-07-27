-- P3-EL module schema for pcc_pediatric_imaging v3.102.0
CREATE TABLE IF NOT EXISTS p3el_pcc_pediatric_imaging (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3el_pcc_pediatric_imaging_tenant ON p3el_pcc_pediatric_imaging(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3el_pcc_pediatric_imaging_encounter ON p3el_pcc_pediatric_imaging(encounter_id);
