-- P3-EE module schema for pcc_neuroendocrine v3.95.0
CREATE TABLE IF NOT EXISTS p3ee_pcc_neuroendocrine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_neuroendocrine_tenant ON p3ee_pcc_neuroendocrine(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_neuroendocrine_encounter ON p3ee_pcc_neuroendocrine(encounter_id);
