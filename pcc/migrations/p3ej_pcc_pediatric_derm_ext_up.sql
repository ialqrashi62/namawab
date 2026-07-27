-- P3-EJ module schema for pcc_pediatric_derm_ext v3.100.0
CREATE TABLE IF NOT EXISTS p3ej_pcc_pediatric_derm_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ej_pcc_pediatric_derm_ext_tenant ON p3ej_pcc_pediatric_derm_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ej_pcc_pediatric_derm_ext_encounter ON p3ej_pcc_pediatric_derm_ext(encounter_id);
