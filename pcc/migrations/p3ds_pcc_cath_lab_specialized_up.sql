-- P3-DS module schema for pcc_cath_lab_specialized v3.83.0
CREATE TABLE IF NOT EXISTS p3ds_pcc_cath_lab_specialized (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ds_pcc_cath_lab_specialized_tenant ON p3ds_pcc_cath_lab_specialized(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ds_pcc_cath_lab_specialized_encounter ON p3ds_pcc_cath_lab_specialized(encounter_id);
