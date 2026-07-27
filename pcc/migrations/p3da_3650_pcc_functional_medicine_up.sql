-- P3-DA module schema for pcc_functional_medicine v3.65.0
CREATE TABLE IF NOT EXISTS p3da_pcc_functional_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3da_pcc_functional_medicine_tenant ON p3da_pcc_functional_medicine(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3da_pcc_functional_medicine_encounter ON p3da_pcc_functional_medicine(encounter_id);
