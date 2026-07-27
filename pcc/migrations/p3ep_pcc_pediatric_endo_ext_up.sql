-- P3-EP module schema for pcc_pediatric_endo_ext v3.106.0
CREATE TABLE IF NOT EXISTS p3ep_pcc_pediatric_endo_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_pediatric_endo_ext_tenant ON p3ep_pcc_pediatric_endo_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_pediatric_endo_ext_encounter ON p3ep_pcc_pediatric_endo_ext(encounter_id);
