-- P3-CS module schema for pcc_code_blue v3.57.0
CREATE TABLE IF NOT EXISTS p3cs_pcc_code_blue (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cs_pcc_code_blue_tenant ON p3cs_pcc_code_blue(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cs_pcc_code_blue_encounter ON p3cs_pcc_code_blue(encounter_id);
