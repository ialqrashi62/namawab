-- P3-EP module schema for pcc_neuro_ext7 v3.106.0
CREATE TABLE IF NOT EXISTS p3ep_pcc_neuro_ext7 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_neuro_ext7_tenant ON p3ep_pcc_neuro_ext7(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_neuro_ext7_encounter ON p3ep_pcc_neuro_ext7(encounter_id);
