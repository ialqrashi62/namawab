-- P3-ES module schema for pcc_neuro_ext10 v3.109.0
CREATE TABLE IF NOT EXISTS p3es_pcc_neuro_ext10 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3es_pcc_neuro_ext10_tenant ON p3es_pcc_neuro_ext10(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3es_pcc_neuro_ext10_encounter ON p3es_pcc_neuro_ext10(encounter_id);
