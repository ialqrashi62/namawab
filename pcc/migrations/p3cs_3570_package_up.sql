-- P3-CS package schema v3.57.0


CREATE SCHEMA IF NOT EXISTS p3cs;

CREATE TABLE IF NOT EXISTS p3cs_pcc_sepsis (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cs_pcc_sepsis_tenant ON p3cs_pcc_sepsis(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cs_pcc_sepsis_encounter ON p3cs_pcc_sepsis(encounter_id);

CREATE TABLE IF NOT EXISTS p3cs_pcc_code_blue (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cs_pcc_code_blue_tenant ON p3cs_pcc_code_blue(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cs_pcc_code_blue_encounter ON p3cs_pcc_code_blue(encounter_id);

CREATE TABLE IF NOT EXISTS p3cs_pcc_stroke_path (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cs_pcc_stroke_path_tenant ON p3cs_pcc_stroke_path(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cs_pcc_stroke_path_encounter ON p3cs_pcc_stroke_path(encounter_id);
