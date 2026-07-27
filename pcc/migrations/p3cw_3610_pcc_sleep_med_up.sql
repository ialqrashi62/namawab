-- P3-CW module schema for pcc_sleep_med v3.61.0
CREATE TABLE IF NOT EXISTS p3cw_pcc_sleep_med (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cw_pcc_sleep_med_tenant ON p3cw_pcc_sleep_med(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cw_pcc_sleep_med_encounter ON p3cw_pcc_sleep_med(encounter_id);
