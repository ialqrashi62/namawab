-- P3-EN module schema for pcc_neuro_ext5 v3.104.0
CREATE TABLE IF NOT EXISTS p3en_pcc_neuro_ext5 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3en_pcc_neuro_ext5_tenant ON p3en_pcc_neuro_ext5(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3en_pcc_neuro_ext5_encounter ON p3en_pcc_neuro_ext5(encounter_id);
