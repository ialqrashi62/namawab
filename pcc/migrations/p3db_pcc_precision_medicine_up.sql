-- P3-DB module schema for pcc_precision_medicine v3.66.0
CREATE TABLE IF NOT EXISTS p3db_pcc_precision_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3db_pcc_precision_medicine_tenant ON p3db_pcc_precision_medicine(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3db_pcc_precision_medicine_encounter ON p3db_pcc_precision_medicine(encounter_id);
