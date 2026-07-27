-- P3-ES module schema for pcc_pediatric_cardio_ext2 v3.109.0
CREATE TABLE IF NOT EXISTS p3es_pcc_pediatric_cardio_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3es_pcc_pediatric_cardio_ext2_tenant ON p3es_pcc_pediatric_cardio_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3es_pcc_pediatric_cardio_ext2_encounter ON p3es_pcc_pediatric_cardio_ext2(encounter_id);
