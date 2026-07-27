-- P3-DN module schema for pcc_dialysis_advanced v3.78.0
CREATE TABLE IF NOT EXISTS p3dn_pcc_dialysis_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dn_pcc_dialysis_advanced_tenant ON p3dn_pcc_dialysis_advanced(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dn_pcc_dialysis_advanced_encounter ON p3dn_pcc_dialysis_advanced(encounter_id);
