-- P3-EN module schema for pcc_pediatric_er_ext v3.104.0
CREATE TABLE IF NOT EXISTS p3en_pcc_pediatric_er_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3en_pcc_pediatric_er_ext_tenant ON p3en_pcc_pediatric_er_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3en_pcc_pediatric_er_ext_encounter ON p3en_pcc_pediatric_er_ext(encounter_id);
