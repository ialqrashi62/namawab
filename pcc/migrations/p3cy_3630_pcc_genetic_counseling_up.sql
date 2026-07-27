-- P3-CY module schema for pcc_genetic_counseling v3.63.0
CREATE TABLE IF NOT EXISTS p3cy_pcc_genetic_counseling (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cy_pcc_genetic_counseling_tenant ON p3cy_pcc_genetic_counseling(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cy_pcc_genetic_counseling_encounter ON p3cy_pcc_genetic_counseling(encounter_id);
