-- P3-EB package schema v3.92.0

CREATE SCHEMA IF NOT EXISTS p3eb;

CREATE TABLE IF NOT EXISTS p3eb_pcc_neonatal_ext3_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eb_pcc_neonatal_ext3_ext_tenant ON p3eb_pcc_neonatal_ext3_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eb_pcc_neonatal_ext3_ext_encounter ON p3eb_pcc_neonatal_ext3_ext(encounter_id);


CREATE TABLE IF NOT EXISTS p3eb_pcc_oncology_radiation (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eb_pcc_oncology_radiation_tenant ON p3eb_pcc_oncology_radiation(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eb_pcc_oncology_radiation_encounter ON p3eb_pcc_oncology_radiation(encounter_id);


CREATE TABLE IF NOT EXISTS p3eb_pcc_plastic_surgery_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eb_pcc_plastic_surgery_ext_tenant ON p3eb_pcc_plastic_surgery_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eb_pcc_plastic_surgery_ext_encounter ON p3eb_pcc_plastic_surgery_ext(encounter_id);


