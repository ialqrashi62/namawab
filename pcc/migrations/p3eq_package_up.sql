-- P3-EQ package schema v3.107.0

CREATE SCHEMA IF NOT EXISTS p3eq;

CREATE TABLE IF NOT EXISTS p3eq_pcc_neuro_ext8 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eq_pcc_neuro_ext8_tenant ON p3eq_pcc_neuro_ext8(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eq_pcc_neuro_ext8_encounter ON p3eq_pcc_neuro_ext8(encounter_id);


CREATE TABLE IF NOT EXISTS p3eq_pcc_pediatric_renal_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eq_pcc_pediatric_renal_ext_tenant ON p3eq_pcc_pediatric_renal_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eq_pcc_pediatric_renal_ext_encounter ON p3eq_pcc_pediatric_renal_ext(encounter_id);


CREATE TABLE IF NOT EXISTS p3eq_pcc_pediatric_pulm_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eq_pcc_pediatric_pulm_ext_tenant ON p3eq_pcc_pediatric_pulm_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eq_pcc_pediatric_pulm_ext_encounter ON p3eq_pcc_pediatric_pulm_ext(encounter_id);


