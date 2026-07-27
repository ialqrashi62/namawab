-- P3-CL package schema v3.50.0


CREATE SCHEMA IF NOT EXISTS p3cl;

CREATE TABLE IF NOT EXISTS p3cl_pcc_cardio_ext4 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cl_pcc_cardio_ext4_tenant ON p3cl_pcc_cardio_ext4(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cl_pcc_cardio_ext4_encounter ON p3cl_pcc_cardio_ext4(encounter_id);

CREATE TABLE IF NOT EXISTS p3cl_pcc_ortho_ext3 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cl_pcc_ortho_ext3_tenant ON p3cl_pcc_ortho_ext3(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cl_pcc_ortho_ext3_encounter ON p3cl_pcc_ortho_ext3(encounter_id);

CREATE TABLE IF NOT EXISTS p3cl_pcc_derma_ext3 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cl_pcc_derma_ext3_tenant ON p3cl_pcc_derma_ext3(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cl_pcc_derma_ext3_encounter ON p3cl_pcc_derma_ext3(encounter_id);
