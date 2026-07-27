-- P3-CF module schema for pcc_telemed v3.44.0
CREATE TABLE IF NOT EXISTS p3cf_pcc_telemed (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cf_pcc_telemed_tenant ON p3cf_pcc_telemed(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cf_pcc_telemed_encounter ON p3cf_pcc_telemed(encounter_id);
