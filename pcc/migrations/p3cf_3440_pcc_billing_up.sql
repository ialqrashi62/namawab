-- P3-CF module schema for pcc_billing v3.44.0
CREATE TABLE IF NOT EXISTS p3cf_pcc_billing (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cf_pcc_billing_tenant ON p3cf_pcc_billing(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cf_pcc_billing_encounter ON p3cf_pcc_billing(encounter_id);
