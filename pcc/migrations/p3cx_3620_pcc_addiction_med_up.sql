-- P3-CX module schema for pcc_addiction_med v3.62.0
CREATE TABLE IF NOT EXISTS p3cx_pcc_addiction_med (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cx_pcc_addiction_med_tenant ON p3cx_pcc_addiction_med(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cx_pcc_addiction_med_encounter ON p3cx_pcc_addiction_med(encounter_id);
