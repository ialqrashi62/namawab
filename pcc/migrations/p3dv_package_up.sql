-- P3-DV package schema v3.86.0

CREATE SCHEMA IF NOT EXISTS p3dv;

CREATE TABLE IF NOT EXISTS p3dv_pcc_transplant_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dv_pcc_transplant_ext2_tenant ON p3dv_pcc_transplant_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dv_pcc_transplant_ext2_encounter ON p3dv_pcc_transplant_ext2(encounter_id);


CREATE TABLE IF NOT EXISTS p3dv_pcc_oncology_precision (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dv_pcc_oncology_precision_tenant ON p3dv_pcc_oncology_precision(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dv_pcc_oncology_precision_encounter ON p3dv_pcc_oncology_precision(encounter_id);


CREATE TABLE IF NOT EXISTS p3dv_pcc_derma_cosmetic_surgery (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dv_pcc_derma_cosmetic_surgery_tenant ON p3dv_pcc_derma_cosmetic_surgery(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dv_pcc_derma_cosmetic_surgery_encounter ON p3dv_pcc_derma_cosmetic_surgery(encounter_id);


