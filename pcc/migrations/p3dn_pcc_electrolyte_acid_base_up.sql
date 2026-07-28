-- P3-DN module schema for pcc_electrolyte_acid_base v3.78.0
CREATE TABLE IF NOT EXISTS p3dn_pcc_electrolyte_acid_base (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dn_pcc_electrolyte_acid_base_tenant ON p3dn_pcc_electrolyte_acid_base(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dn_pcc_electrolyte_acid_base_encounter ON p3dn_pcc_electrolyte_acid_base(encounter_id);
