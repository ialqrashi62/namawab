-- P3-EM module schema for pcc_neuro_ext4 v3.103.0
CREATE TABLE IF NOT EXISTS p3em_pcc_neuro_ext4 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3em_pcc_neuro_ext4_tenant ON p3em_pcc_neuro_ext4(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3em_pcc_neuro_ext4_encounter ON p3em_pcc_neuro_ext4(encounter_id);
