-- P3-CA module schema for pcc_audit v3.39.0
CREATE TABLE IF NOT EXISTS p3ca_pcc_audit (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ca_pcc_audit_tenant ON p3ca_pcc_audit(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ca_pcc_audit_encounter ON p3ca_pcc_audit(encounter_id);
