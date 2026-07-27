-- P3-CT module schema for pcc_ambulatory v3.58.0
CREATE TABLE IF NOT EXISTS p3ct_pcc_ambulatory (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ct_pcc_ambulatory_tenant ON p3ct_pcc_ambulatory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ct_pcc_ambulatory_encounter ON p3ct_pcc_ambulatory(encounter_id);
