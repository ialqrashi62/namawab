-- P3-CH module schema for pcc_postop v3.46.0
CREATE TABLE IF NOT EXISTS p3ch_pcc_postop (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ch_pcc_postop_tenant ON p3ch_pcc_postop(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ch_pcc_postop_encounter ON p3ch_pcc_postop(encounter_id);
