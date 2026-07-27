-- P3-BY package schema v3.37.0


CREATE SCHEMA IF NOT EXISTS p3by;

CREATE TABLE IF NOT EXISTS p3by_allergy_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3by_allergy_ext2_tenant ON p3by_allergy_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3by_allergy_ext2_encounter ON p3by_allergy_ext2(encounter_id);

CREATE TABLE IF NOT EXISTS p3by_cv_ext3 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3by_cv_ext3_tenant ON p3by_cv_ext3(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3by_cv_ext3_encounter ON p3by_cv_ext3(encounter_id);

CREATE TABLE IF NOT EXISTS p3by_sleep_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3by_sleep_ext2_tenant ON p3by_sleep_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3by_sleep_ext2_encounter ON p3by_sleep_ext2(encounter_id);
