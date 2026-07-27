-- P3-BW package schema v3.35.0


CREATE SCHEMA IF NOT EXISTS p3bw;

CREATE TABLE IF NOT EXISTS p3bw_psych_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3bw_psych_ext2_tenant ON p3bw_psych_ext2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3bw_psych_ext2_encounter ON p3bw_psych_ext2(encounter_id);

CREATE TABLE IF NOT EXISTS p3bw_onco_ext3 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3bw_onco_ext3_tenant ON p3bw_onco_ext3(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3bw_onco_ext3_encounter ON p3bw_onco_ext3(encounter_id);

CREATE TABLE IF NOT EXISTS p3bw_repro_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3bw_repro_ext_tenant ON p3bw_repro_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3bw_repro_ext_encounter ON p3bw_repro_ext(encounter_id);
