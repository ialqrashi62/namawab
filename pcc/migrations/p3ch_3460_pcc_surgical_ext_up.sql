-- P3-CH module schema for pcc_surgical_ext v3.46.0
CREATE TABLE IF NOT EXISTS p3ch_pcc_surgical_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ch_pcc_surgical_ext_tenant ON p3ch_pcc_surgical_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ch_pcc_surgical_ext_encounter ON p3ch_pcc_surgical_ext(encounter_id);
