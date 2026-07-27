-- P3-CC module schema for pcc_clinical_dx v3.41.0
CREATE TABLE IF NOT EXISTS p3cc_pcc_clinical_dx (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cc_pcc_clinical_dx_tenant ON p3cc_pcc_clinical_dx(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cc_pcc_clinical_dx_encounter ON p3cc_pcc_clinical_dx(encounter_id);
