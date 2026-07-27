-- P3-EE module schema for pcc_pediatric_neuro v3.95.0
CREATE TABLE IF NOT EXISTS p3ee_pcc_pediatric_neuro (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_pediatric_neuro_tenant ON p3ee_pcc_pediatric_neuro(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_pediatric_neuro_encounter ON p3ee_pcc_pediatric_neuro(encounter_id);
