-- P3-EQ module schema for pcc_pediatric_pulm_ext v3.107.0
CREATE TABLE IF NOT EXISTS p3eq_pcc_pediatric_pulm_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3eq_pcc_pediatric_pulm_ext_tenant ON p3eq_pcc_pediatric_pulm_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3eq_pcc_pediatric_pulm_ext_encounter ON p3eq_pcc_pediatric_pulm_ext(encounter_id);
