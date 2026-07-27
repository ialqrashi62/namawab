-- P3-EA module schema for pcc_interventional_radiology v3.91.0
CREATE TABLE IF NOT EXISTS p3ea_pcc_interventional_radiology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_interventional_radiology_tenant ON p3ea_pcc_interventional_radiology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_interventional_radiology_encounter ON p3ea_pcc_interventional_radiology(encounter_id);
