-- P3-CP package schema v3.54.0


CREATE SCHEMA IF NOT EXISTS p3cp;

CREATE TABLE IF NOT EXISTS p3cp_pcc_rehab_ext3 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cp_pcc_rehab_ext3_tenant ON p3cp_pcc_rehab_ext3(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cp_pcc_rehab_ext3_encounter ON p3cp_pcc_rehab_ext3(encounter_id);

CREATE TABLE IF NOT EXISTS p3cp_pcc_pall_ext3 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cp_pcc_pall_ext3_tenant ON p3cp_pcc_pall_ext3(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cp_pcc_pall_ext3_encounter ON p3cp_pcc_pall_ext3(encounter_id);

CREATE TABLE IF NOT EXISTS p3cp_pcc_home_health (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cp_pcc_home_health_tenant ON p3cp_pcc_home_health(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cp_pcc_home_health_encounter ON p3cp_pcc_home_health(encounter_id);
