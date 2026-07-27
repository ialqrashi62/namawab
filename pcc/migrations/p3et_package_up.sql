-- P3-ET package schema v3.110.0

CREATE SCHEMA IF NOT EXISTS p3et;

CREATE TABLE IF NOT EXISTS p3et_pcc_neuro_ext11 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3et_pcc_neuro_ext11_tenant ON p3et_pcc_neuro_ext11(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3et_pcc_neuro_ext11_encounter ON p3et_pcc_neuro_ext11(encounter_id);


CREATE TABLE IF NOT EXISTS p3et_pcc_pediatric_neuro_surg_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3et_pcc_pediatric_neuro_surg_ext_tenant ON p3et_pcc_pediatric_neuro_surg_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3et_pcc_pediatric_neuro_surg_ext_encounter ON p3et_pcc_pediatric_neuro_surg_ext(encounter_id);


CREATE TABLE IF NOT EXISTS p3et_pcc_pediatric_endo_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3et_pcc_pediatric_endo_ext2_tenant ON p3et_pcc_pediatric_endo_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3et_pcc_pediatric_endo_ext2_encounter ON p3et_pcc_pediatric_endo_ext2(encounter_id);


