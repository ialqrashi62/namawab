-- P3-EA module schema for pcc_genetic_counseling_ext v3.91.0
CREATE TABLE IF NOT EXISTS p3ea_pcc_genetic_counseling_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_genetic_counseling_ext_tenant ON p3ea_pcc_genetic_counseling_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_genetic_counseling_ext_encounter ON p3ea_pcc_genetic_counseling_ext(encounter_id);
