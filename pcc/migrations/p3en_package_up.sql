-- P3-EN package schema v3.104.0

CREATE SCHEMA IF NOT EXISTS p3en;

CREATE TABLE IF NOT EXISTS p3en_pcc_neuro_ext5 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3en_pcc_neuro_ext5_tenant ON p3en_pcc_neuro_ext5(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3en_pcc_neuro_ext5_encounter ON p3en_pcc_neuro_ext5(encounter_id);


CREATE TABLE IF NOT EXISTS p3en_pcc_pediatric_icu_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3en_pcc_pediatric_icu_ext_tenant ON p3en_pcc_pediatric_icu_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3en_pcc_pediatric_icu_ext_encounter ON p3en_pcc_pediatric_icu_ext(encounter_id);


CREATE TABLE IF NOT EXISTS p3en_pcc_pediatric_er_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3en_pcc_pediatric_er_ext_tenant ON p3en_pcc_pediatric_er_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3en_pcc_pediatric_er_ext_encounter ON p3en_pcc_pediatric_er_ext(encounter_id);


