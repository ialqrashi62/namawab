-- P3-CP module schema for pcc_home_health v3.54.0
CREATE TABLE IF NOT EXISTS p3cp_pcc_home_health (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cp_pcc_home_health_tenant ON p3cp_pcc_home_health(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cp_pcc_home_health_encounter ON p3cp_pcc_home_health(encounter_id);
