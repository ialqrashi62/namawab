-- P3-BS package schema v3.31.0


CREATE SCHEMA IF NOT EXISTS p3bs;

CREATE TABLE IF NOT EXISTS p3bs_geri_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3bs_geri_ext_tenant ON p3bs_geri_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3bs_geri_ext_encounter ON p3bs_geri_ext(encounter_id);

CREATE TABLE IF NOT EXISTS p3bs_gen_med_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3bs_gen_med_ext_tenant ON p3bs_gen_med_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3bs_gen_med_ext_encounter ON p3bs_gen_med_ext(encounter_id);

CREATE TABLE IF NOT EXISTS p3bs_trauma_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3bs_trauma_ext_tenant ON p3bs_trauma_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3bs_trauma_ext_encounter ON p3bs_trauma_ext(encounter_id);
