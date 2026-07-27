-- P3-CT module schema for pcc_specialty_clinic v3.58.0
CREATE TABLE IF NOT EXISTS p3ct_pcc_specialty_clinic (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ct_pcc_specialty_clinic_tenant ON p3ct_pcc_specialty_clinic(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ct_pcc_specialty_clinic_encounter ON p3ct_pcc_specialty_clinic(encounter_id);
