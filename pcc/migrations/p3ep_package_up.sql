-- P3-EP package schema v3.106.0

CREATE SCHEMA IF NOT EXISTS p3ep;

CREATE TABLE IF NOT EXISTS p3ep_pcc_neuro_ext7 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_neuro_ext7_tenant ON p3ep_pcc_neuro_ext7(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_neuro_ext7_encounter ON p3ep_pcc_neuro_ext7(encounter_id);


CREATE TABLE IF NOT EXISTS p3ep_pcc_pediatric_surg_oncology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_pediatric_surg_oncology_tenant ON p3ep_pcc_pediatric_surg_oncology(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_pediatric_surg_oncology_encounter ON p3ep_pcc_pediatric_surg_oncology(encounter_id);


CREATE TABLE IF NOT EXISTS p3ep_pcc_pediatric_endo_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_pediatric_endo_ext_tenant ON p3ep_pcc_pediatric_endo_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_pediatric_endo_ext_encounter ON p3ep_pcc_pediatric_endo_ext(encounter_id);


