-- P3-ED package schema v3.94.0

CREATE SCHEMA IF NOT EXISTS p3ed;

CREATE TABLE IF NOT EXISTS p3ed_pcc_neuro_otology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ed_pcc_neuro_otology_tenant ON p3ed_pcc_neuro_otology(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ed_pcc_neuro_otology_encounter ON p3ed_pcc_neuro_otology(encounter_id);


CREATE TABLE IF NOT EXISTS p3ed_pcc_pediatric_urology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ed_pcc_pediatric_urology_tenant ON p3ed_pcc_pediatric_urology(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ed_pcc_pediatric_urology_encounter ON p3ed_pcc_pediatric_urology(encounter_id);


CREATE TABLE IF NOT EXISTS p3ed_pcc_dental_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ed_pcc_dental_advanced_tenant ON p3ed_pcc_dental_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ed_pcc_dental_advanced_encounter ON p3ed_pcc_dental_advanced(encounter_id);


