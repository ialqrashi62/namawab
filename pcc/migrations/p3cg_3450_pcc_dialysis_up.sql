-- P3-CG module schema for pcc_dialysis v3.45.0
CREATE TABLE IF NOT EXISTS p3cg_pcc_dialysis (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cg_pcc_dialysis_tenant ON p3cg_pcc_dialysis(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cg_pcc_dialysis_encounter ON p3cg_pcc_dialysis(encounter_id);
