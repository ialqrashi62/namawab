-- P3-DC module schema for pcc_space_medicine v3.67.0
CREATE TABLE IF NOT EXISTS p3dc_pcc_space_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dc_pcc_space_medicine_tenant ON p3dc_pcc_space_medicine(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dc_pcc_space_medicine_encounter ON p3dc_pcc_space_medicine(encounter_id);
