-- P3-DI module schema for pcc_cardiovascular_optimization v3.73.0
CREATE TABLE IF NOT EXISTS p3di_pcc_cardiovascular_optimization (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3di_pcc_cardiovascular_optimization_tenant ON p3di_pcc_cardiovascular_optimization(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3di_pcc_cardiovascular_optimization_encounter ON p3di_pcc_cardiovascular_optimization(encounter_id);
