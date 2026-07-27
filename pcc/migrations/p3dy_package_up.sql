-- P3-DY package schema v3.89.0

CREATE SCHEMA IF NOT EXISTS p3dy;

CREATE TABLE IF NOT EXISTS p3dy_pcc_bariatric_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dy_pcc_bariatric_medicine_tenant ON p3dy_pcc_bariatric_medicine(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dy_pcc_bariatric_medicine_encounter ON p3dy_pcc_bariatric_medicine(encounter_id);


CREATE TABLE IF NOT EXISTS p3dy_pcc_hepato_pancreatic_surgery (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dy_pcc_hepato_pancreatic_surgery_tenant ON p3dy_pcc_hepato_pancreatic_surgery(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dy_pcc_hepato_pancreatic_surgery_encounter ON p3dy_pcc_hepato_pancreatic_surgery(encounter_id);


CREATE TABLE IF NOT EXISTS p3dy_pcc_colorectal_surgery (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dy_pcc_colorectal_surgery_tenant ON p3dy_pcc_colorectal_surgery(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dy_pcc_colorectal_surgery_encounter ON p3dy_pcc_colorectal_surgery(encounter_id);


