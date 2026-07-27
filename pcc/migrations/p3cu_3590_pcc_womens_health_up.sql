-- P3-CU module schema for pcc_womens_health v3.59.0
CREATE TABLE IF NOT EXISTS p3cu_pcc_womens_health (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cu_pcc_womens_health_tenant ON p3cu_pcc_womens_health(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cu_pcc_womens_health_encounter ON p3cu_pcc_womens_health(encounter_id);
