-- P3-CB package schema v3.40.0


CREATE SCHEMA IF NOT EXISTS p3cb;

CREATE TABLE IF NOT EXISTS p3cb_pcc_workflow (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cb_pcc_workflow_tenant ON p3cb_pcc_workflow(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cb_pcc_workflow_encounter ON p3cb_pcc_workflow(encounter_id);

CREATE TABLE IF NOT EXISTS p3cb_pcc_analytics (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cb_pcc_analytics_tenant ON p3cb_pcc_analytics(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cb_pcc_analytics_encounter ON p3cb_pcc_analytics(encounter_id);

CREATE TABLE IF NOT EXISTS p3cb_pcc_compliance (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cb_pcc_compliance_tenant ON p3cb_pcc_compliance(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cb_pcc_compliance_encounter ON p3cb_pcc_compliance(encounter_id);
