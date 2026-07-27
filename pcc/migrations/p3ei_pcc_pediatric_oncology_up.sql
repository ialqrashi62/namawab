-- P3-EI module schema for pcc_pediatric_oncology v3.99.0
CREATE TABLE IF NOT EXISTS p3ei_pcc_pediatric_oncology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ei_pcc_pediatric_oncology_tenant ON p3ei_pcc_pediatric_oncology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ei_pcc_pediatric_oncology_encounter ON p3ei_pcc_pediatric_oncology(encounter_id);
