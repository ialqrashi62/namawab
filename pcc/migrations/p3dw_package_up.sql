-- P3-DW package schema v3.87.0

CREATE SCHEMA IF NOT EXISTS p3dw;

CREATE TABLE IF NOT EXISTS p3dw_pcc_sports_cardiology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_sports_cardiology_tenant ON p3dw_pcc_sports_cardiology(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_sports_cardiology_encounter ON p3dw_pcc_sports_cardiology(encounter_id);


CREATE TABLE IF NOT EXISTS p3dw_pcc_pediatric_surgery (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_pediatric_surgery_tenant ON p3dw_pcc_pediatric_surgery(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_pediatric_surgery_encounter ON p3dw_pcc_pediatric_surgery(encounter_id);


CREATE TABLE IF NOT EXISTS p3dw_pcc_neuro_rehab_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_neuro_rehab_ext_tenant ON p3dw_pcc_neuro_rehab_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_neuro_rehab_ext_encounter ON p3dw_pcc_neuro_rehab_ext(encounter_id);


