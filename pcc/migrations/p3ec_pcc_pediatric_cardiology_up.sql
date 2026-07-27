-- P3-EC module schema for pcc_pediatric_cardiology v3.93.0
CREATE TABLE IF NOT EXISTS p3ec_pcc_pediatric_cardiology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ec_pcc_pediatric_cardiology_tenant ON p3ec_pcc_pediatric_cardiology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ec_pcc_pediatric_cardiology_encounter ON p3ec_pcc_pediatric_cardiology(encounter_id);
