-- P3-CA module schema for pcc_utility v3.39.0
CREATE TABLE IF NOT EXISTS p3ca_pcc_utility (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ca_pcc_utility_tenant ON p3ca_pcc_utility(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ca_pcc_utility_encounter ON p3ca_pcc_utility(encounter_id);
