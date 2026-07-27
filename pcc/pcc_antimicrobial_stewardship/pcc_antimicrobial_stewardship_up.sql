-- P3-DM module schema for pcc_antimicrobial_stewardship v3.77.0
CREATE TABLE IF NOT EXISTS p3dm_pcc_antimicrobial_stewardship (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dm_pcc_antimicrobial_stewardship_tenant ON p3dm_pcc_antimicrobial_stewardship(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dm_pcc_antimicrobial_stewardship_encounter ON p3dm_pcc_antimicrobial_stewardship(encounter_id);
