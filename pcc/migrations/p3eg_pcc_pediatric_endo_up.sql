-- P3-EG module schema for pcc_pediatric_endo v3.97.0
CREATE TABLE IF NOT EXISTS p3eg_pcc_pediatric_endo (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3eg_pcc_pediatric_endo_tenant ON p3eg_pcc_pediatric_endo(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3eg_pcc_pediatric_endo_encounter ON p3eg_pcc_pediatric_endo(encounter_id);
