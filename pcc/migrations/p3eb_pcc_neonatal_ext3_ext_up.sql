-- P3-EB module schema for pcc_neonatal_ext3_ext v3.92.0
CREATE TABLE IF NOT EXISTS p3eb_pcc_neonatal_ext3_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3eb_pcc_neonatal_ext3_ext_tenant ON p3eb_pcc_neonatal_ext3_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3eb_pcc_neonatal_ext3_ext_encounter ON p3eb_pcc_neonatal_ext3_ext(encounter_id);
