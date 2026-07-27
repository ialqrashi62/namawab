-- P3-EH module schema for pcc_pediatric_rheum v3.98.0
CREATE TABLE IF NOT EXISTS p3eh_pcc_pediatric_rheum (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_pediatric_rheum_tenant ON p3eh_pcc_pediatric_rheum(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_pediatric_rheum_encounter ON p3eh_pcc_pediatric_rheum(encounter_id);
