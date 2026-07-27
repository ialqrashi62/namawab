-- P3-CC package schema v3.41.0


CREATE SCHEMA IF NOT EXISTS p3cc;

CREATE TABLE IF NOT EXISTS p3cc_pcc_decision (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cc_pcc_decision_tenant ON p3cc_pcc_decision(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cc_pcc_decision_encounter ON p3cc_pcc_decision(encounter_id);

CREATE TABLE IF NOT EXISTS p3cc_pcc_clinical_dx (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cc_pcc_clinical_dx_tenant ON p3cc_pcc_clinical_dx(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cc_pcc_clinical_dx_encounter ON p3cc_pcc_clinical_dx(encounter_id);

CREATE TABLE IF NOT EXISTS p3cc_pcc_drug (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cc_pcc_drug_tenant ON p3cc_pcc_drug(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cc_pcc_drug_encounter ON p3cc_pcc_drug(encounter_id);
