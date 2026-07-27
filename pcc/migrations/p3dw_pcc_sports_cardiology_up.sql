-- P3-DW module schema for pcc_sports_cardiology v3.87.0
CREATE TABLE IF NOT EXISTS p3dw_pcc_sports_cardiology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_sports_cardiology_tenant ON p3dw_pcc_sports_cardiology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_sports_cardiology_encounter ON p3dw_pcc_sports_cardiology(encounter_id);
