-- P3-ER package schema v3.108.0

CREATE SCHEMA IF NOT EXISTS p3er;

CREATE TABLE IF NOT EXISTS p3er_pcc_neuro_ext9 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3er_pcc_neuro_ext9_tenant ON p3er_pcc_neuro_ext9(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3er_pcc_neuro_ext9_encounter ON p3er_pcc_neuro_ext9(encounter_id);


CREATE TABLE IF NOT EXISTS p3er_pcc_pediatric_gi_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3er_pcc_pediatric_gi_ext2_tenant ON p3er_pcc_pediatric_gi_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3er_pcc_pediatric_gi_ext2_encounter ON p3er_pcc_pediatric_gi_ext2(encounter_id);


CREATE TABLE IF NOT EXISTS p3er_pcc_pediatric_neuro_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3er_pcc_pediatric_neuro_ext_tenant ON p3er_pcc_pediatric_neuro_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3er_pcc_pediatric_neuro_ext_encounter ON p3er_pcc_pediatric_neuro_ext(encounter_id);


