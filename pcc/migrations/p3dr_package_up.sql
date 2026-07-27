-- P3-DR package schema v3.82.0


CREATE SCHEMA IF NOT EXISTS p3dr;

CREATE TABLE IF NOT EXISTS p3dr_pcc_obstetrics_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dr_pcc_obstetrics_advanced_tenant ON p3dr_pcc_obstetrics_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dr_pcc_obstetrics_advanced_encounter ON p3dr_pcc_obstetrics_advanced(encounter_id);

CREATE TABLE IF NOT EXISTS p3dr_pcc_gynecology_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dr_pcc_gynecology_advanced_tenant ON p3dr_pcc_gynecology_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dr_pcc_gynecology_advanced_encounter ON p3dr_pcc_gynecology_advanced(encounter_id);

CREATE TABLE IF NOT EXISTS p3dr_pcc_maternal_fetal_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dr_pcc_maternal_fetal_advanced_tenant ON p3dr_pcc_maternal_fetal_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dr_pcc_maternal_fetal_advanced_encounter ON p3dr_pcc_maternal_fetal_advanced(encounter_id);
