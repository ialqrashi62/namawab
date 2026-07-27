-- P3-CF package schema v3.44.0


CREATE SCHEMA IF NOT EXISTS p3cf;

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

CREATE TABLE IF NOT EXISTS p3cf_pcc_scheduling (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cf_pcc_scheduling_tenant ON p3cf_pcc_scheduling(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cf_pcc_scheduling_encounter ON p3cf_pcc_scheduling(encounter_id);

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
