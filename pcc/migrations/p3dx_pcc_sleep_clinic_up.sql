-- P3-DX module schema for pcc_sleep_clinic v3.88.0
CREATE TABLE IF NOT EXISTS p3dx_pcc_sleep_clinic (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dx_pcc_sleep_clinic_tenant ON p3dx_pcc_sleep_clinic(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dx_pcc_sleep_clinic_encounter ON p3dx_pcc_sleep_clinic(encounter_id);
