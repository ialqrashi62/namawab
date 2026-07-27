-- P3-EM package schema v3.103.0

CREATE SCHEMA IF NOT EXISTS p3em;

CREATE TABLE IF NOT EXISTS p3em_pcc_neuro_ext4 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3em_pcc_neuro_ext4_tenant ON p3em_pcc_neuro_ext4(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3em_pcc_neuro_ext4_encounter ON p3em_pcc_neuro_ext4(encounter_id);


CREATE TABLE IF NOT EXISTS p3em_pcc_pediatric_surg_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3em_pcc_pediatric_surg_ext_tenant ON p3em_pcc_pediatric_surg_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3em_pcc_pediatric_surg_ext_encounter ON p3em_pcc_pediatric_surg_ext(encounter_id);


CREATE TABLE IF NOT EXISTS p3em_pcc_pediatric_rehab (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3em_pcc_pediatric_rehab_tenant ON p3em_pcc_pediatric_rehab(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3em_pcc_pediatric_rehab_encounter ON p3em_pcc_pediatric_rehab(encounter_id);


