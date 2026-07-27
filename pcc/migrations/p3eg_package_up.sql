-- P3-EG package schema v3.97.0

CREATE SCHEMA IF NOT EXISTS p3eg;

CREATE TABLE IF NOT EXISTS p3eg_pcc_neurotology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eg_pcc_neurotology_tenant ON p3eg_pcc_neurotology(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eg_pcc_neurotology_encounter ON p3eg_pcc_neurotology(encounter_id);


CREATE TABLE IF NOT EXISTS p3eg_pcc_pediatric_endo (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eg_pcc_pediatric_endo_tenant ON p3eg_pcc_pediatric_endo(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eg_pcc_pediatric_endo_encounter ON p3eg_pcc_pediatric_endo(encounter_id);


CREATE TABLE IF NOT EXISTS p3eg_pcc_pediatric_pulm (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eg_pcc_pediatric_pulm_tenant ON p3eg_pcc_pediatric_pulm(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eg_pcc_pediatric_pulm_encounter ON p3eg_pcc_pediatric_pulm(encounter_id);


