-- P3-DA package schema v3.65.0


CREATE SCHEMA IF NOT EXISTS p3da;

CREATE TABLE IF NOT EXISTS p3da_pcc_integrative_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3da_pcc_integrative_medicine_tenant ON p3da_pcc_integrative_medicine(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3da_pcc_integrative_medicine_encounter ON p3da_pcc_integrative_medicine(encounter_id);

CREATE TABLE IF NOT EXISTS p3da_pcc_functional_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3da_pcc_functional_medicine_tenant ON p3da_pcc_functional_medicine(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3da_pcc_functional_medicine_encounter ON p3da_pcc_functional_medicine(encounter_id);

CREATE TABLE IF NOT EXISTS p3da_pcc_longevity_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3da_pcc_longevity_medicine_tenant ON p3da_pcc_longevity_medicine(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3da_pcc_longevity_medicine_encounter ON p3da_pcc_longevity_medicine(encounter_id);
