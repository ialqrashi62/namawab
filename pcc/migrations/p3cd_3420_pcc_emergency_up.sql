-- P3-CD module schema for pcc_emergency v3.42.0
CREATE TABLE IF NOT EXISTS p3cd_pcc_emergency (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cd_pcc_emergency_tenant ON p3cd_pcc_emergency(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cd_pcc_emergency_encounter ON p3cd_pcc_emergency(encounter_id);
