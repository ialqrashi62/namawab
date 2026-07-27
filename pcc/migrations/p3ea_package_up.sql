-- P3-EA package schema v3.91.0

CREATE SCHEMA IF NOT EXISTS p3ea;

CREATE TABLE IF NOT EXISTS p3ea_pcc_wound_care_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_wound_care_advanced_tenant ON p3ea_pcc_wound_care_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_wound_care_advanced_encounter ON p3ea_pcc_wound_care_advanced(encounter_id);


CREATE TABLE IF NOT EXISTS p3ea_pcc_genetic_counseling_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_genetic_counseling_ext_tenant ON p3ea_pcc_genetic_counseling_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_genetic_counseling_ext_encounter ON p3ea_pcc_genetic_counseling_ext(encounter_id);


CREATE TABLE IF NOT EXISTS p3ea_pcc_interventional_radiology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_interventional_radiology_tenant ON p3ea_pcc_interventional_radiology(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_interventional_radiology_encounter ON p3ea_pcc_interventional_radiology(encounter_id);


