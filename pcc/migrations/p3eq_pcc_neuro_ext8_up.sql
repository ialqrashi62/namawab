-- P3-EQ module schema for pcc_neuro_ext8 v3.107.0
CREATE TABLE IF NOT EXISTS p3eq_pcc_neuro_ext8 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3eq_pcc_neuro_ext8_tenant ON p3eq_pcc_neuro_ext8(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3eq_pcc_neuro_ext8_encounter ON p3eq_pcc_neuro_ext8(encounter_id);
