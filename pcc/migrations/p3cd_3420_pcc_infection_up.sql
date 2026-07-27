-- P3-CD module schema for pcc_infection v3.42.0
CREATE TABLE IF NOT EXISTS p3cd_pcc_infection (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cd_pcc_infection_tenant ON p3cd_pcc_infection(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cd_pcc_infection_encounter ON p3cd_pcc_infection(encounter_id);
