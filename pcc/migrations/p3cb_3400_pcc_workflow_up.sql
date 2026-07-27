-- P3-CB module schema for pcc_workflow v3.40.0
CREATE TABLE IF NOT EXISTS p3cb_pcc_workflow (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cb_pcc_workflow_tenant ON p3cb_pcc_workflow(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cb_pcc_workflow_encounter ON p3cb_pcc_workflow(encounter_id);
