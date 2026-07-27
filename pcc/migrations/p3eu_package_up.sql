-- P3-EU package schema v3.111.0

CREATE SCHEMA IF NOT EXISTS p3eu;

CREATE TABLE IF NOT EXISTS p3eu_pcc_neuro_ext12 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eu_pcc_neuro_ext12_tenant ON p3eu_pcc_neuro_ext12(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eu_pcc_neuro_ext12_encounter ON p3eu_pcc_neuro_ext12(encounter_id);


CREATE TABLE IF NOT EXISTS p3eu_pcc_pediatric_psych_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eu_pcc_pediatric_psych_ext2_tenant ON p3eu_pcc_pediatric_psych_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eu_pcc_pediatric_psych_ext2_encounter ON p3eu_pcc_pediatric_psych_ext2(encounter_id);


CREATE TABLE IF NOT EXISTS p3eu_pcc_pediatric_derm_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eu_pcc_pediatric_derm_ext2_tenant ON p3eu_pcc_pediatric_derm_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eu_pcc_pediatric_derm_ext2_encounter ON p3eu_pcc_pediatric_derm_ext2(encounter_id);


