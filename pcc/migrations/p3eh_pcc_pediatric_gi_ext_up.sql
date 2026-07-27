-- P3-EH module schema for pcc_pediatric_gi_ext v3.98.0
CREATE TABLE IF NOT EXISTS p3eh_pcc_pediatric_gi_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_pediatric_gi_ext_tenant ON p3eh_pcc_pediatric_gi_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_pediatric_gi_ext_encounter ON p3eh_pcc_pediatric_gi_ext(encounter_id);
