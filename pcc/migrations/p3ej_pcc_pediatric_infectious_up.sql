-- P3-EJ module schema for pcc_pediatric_infectious v3.100.0
CREATE TABLE IF NOT EXISTS p3ej_pcc_pediatric_infectious (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ej_pcc_pediatric_infectious_tenant ON p3ej_pcc_pediatric_infectious(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ej_pcc_pediatric_infectious_encounter ON p3ej_pcc_pediatric_infectious(encounter_id);
