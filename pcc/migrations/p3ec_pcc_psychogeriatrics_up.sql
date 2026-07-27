-- P3-EC module schema for pcc_psychogeriatrics v3.93.0
CREATE TABLE IF NOT EXISTS p3ec_pcc_psychogeriatrics (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ec_pcc_psychogeriatrics_tenant ON p3ec_pcc_psychogeriatrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ec_pcc_psychogeriatrics_encounter ON p3ec_pcc_psychogeriatrics(encounter_id);
