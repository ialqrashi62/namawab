-- P3-DW module schema for pcc_pediatric_surgery v3.87.0
CREATE TABLE IF NOT EXISTS p3dw_pcc_pediatric_surgery (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_pediatric_surgery_tenant ON p3dw_pcc_pediatric_surgery(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_pediatric_surgery_encounter ON p3dw_pcc_pediatric_surgery(encounter_id);
