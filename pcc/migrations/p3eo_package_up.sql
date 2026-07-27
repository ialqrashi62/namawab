-- P3-EO package schema v3.105.0

CREATE SCHEMA IF NOT EXISTS p3eo;

CREATE TABLE IF NOT EXISTS p3eo_pcc_neuro_ext6 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eo_pcc_neuro_ext6_tenant ON p3eo_pcc_neuro_ext6(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eo_pcc_neuro_ext6_encounter ON p3eo_pcc_neuro_ext6(encounter_id);


CREATE TABLE IF NOT EXISTS p3eo_pcc_pediatric_psych_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eo_pcc_pediatric_psych_ext_tenant ON p3eo_pcc_pediatric_psych_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eo_pcc_pediatric_psych_ext_encounter ON p3eo_pcc_pediatric_psych_ext(encounter_id);


CREATE TABLE IF NOT EXISTS p3eo_pcc_pediatric_cardio_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eo_pcc_pediatric_cardio_ext_tenant ON p3eo_pcc_pediatric_cardio_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eo_pcc_pediatric_cardio_ext_encounter ON p3eo_pcc_pediatric_cardio_ext(encounter_id);


