-- P3-CI package schema v3.47.0


CREATE SCHEMA IF NOT EXISTS p3ci;

CREATE TABLE IF NOT EXISTS p3ci_pcc_lab_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ci_pcc_lab_ext2_tenant ON p3ci_pcc_lab_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ci_pcc_lab_ext2_encounter ON p3ci_pcc_lab_ext2(encounter_id);

CREATE TABLE IF NOT EXISTS p3ci_pcc_path_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ci_pcc_path_ext_tenant ON p3ci_pcc_path_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ci_pcc_path_ext_encounter ON p3ci_pcc_path_ext(encounter_id);

CREATE TABLE IF NOT EXISTS p3ci_pcc_rad_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ci_pcc_rad_ext2_tenant ON p3ci_pcc_rad_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ci_pcc_rad_ext2_encounter ON p3ci_pcc_rad_ext2(encounter_id);
