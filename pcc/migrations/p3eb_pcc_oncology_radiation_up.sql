-- P3-EB module schema for pcc_oncology_radiation v3.92.0
CREATE TABLE IF NOT EXISTS p3eb_pcc_oncology_radiation (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3eb_pcc_oncology_radiation_tenant ON p3eb_pcc_oncology_radiation(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3eb_pcc_oncology_radiation_encounter ON p3eb_pcc_oncology_radiation(encounter_id);
