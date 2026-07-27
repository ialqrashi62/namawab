-- P3-DD module schema for pcc_performance_medicine v3.68.0
CREATE TABLE IF NOT EXISTS p3dd_pcc_performance_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_performance_medicine_tenant ON p3dd_pcc_performance_medicine(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_performance_medicine_encounter ON p3dd_pcc_performance_medicine(encounter_id);
