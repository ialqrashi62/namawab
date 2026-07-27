-- P3-CX module schema for pcc_weight_mgmt v3.62.0
CREATE TABLE IF NOT EXISTS p3cx_pcc_weight_mgmt (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cx_pcc_weight_mgmt_tenant ON p3cx_pcc_weight_mgmt(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cx_pcc_weight_mgmt_encounter ON p3cx_pcc_weight_mgmt(encounter_id);
