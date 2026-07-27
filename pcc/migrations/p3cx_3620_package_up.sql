-- P3-CX package schema v3.62.0


CREATE SCHEMA IF NOT EXISTS p3cx;

CREATE TABLE IF NOT EXISTS p3cx_pcc_weight_mgmt (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cx_pcc_weight_mgmt_tenant ON p3cx_pcc_weight_mgmt(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cx_pcc_weight_mgmt_encounter ON p3cx_pcc_weight_mgmt(encounter_id);

CREATE TABLE IF NOT EXISTS p3cx_pcc_smoking_cessation (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cx_pcc_smoking_cessation_tenant ON p3cx_pcc_smoking_cessation(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cx_pcc_smoking_cessation_encounter ON p3cx_pcc_smoking_cessation(encounter_id);

CREATE TABLE IF NOT EXISTS p3cx_pcc_addiction_med (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cx_pcc_addiction_med_tenant ON p3cx_pcc_addiction_med(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cx_pcc_addiction_med_encounter ON p3cx_pcc_addiction_med(encounter_id);
