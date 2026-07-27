-- P3-DG module schema for pcc_hormone_optimization v3.71.0
CREATE TABLE IF NOT EXISTS p3dg_pcc_hormone_optimization (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dg_pcc_hormone_optimization_tenant ON p3dg_pcc_hormone_optimization(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dg_pcc_hormone_optimization_encounter ON p3dg_pcc_hormone_optimization(encounter_id);
