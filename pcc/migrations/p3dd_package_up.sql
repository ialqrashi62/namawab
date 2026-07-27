-- P3-DD package schema v3.68.0


CREATE SCHEMA IF NOT EXISTS p3dd;

CREATE TABLE IF NOT EXISTS p3dd_pcc_sports_science (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_sports_science_tenant ON p3dd_pcc_sports_science(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_sports_science_encounter ON p3dd_pcc_sports_science(encounter_id);

CREATE TABLE IF NOT EXISTS p3dd_pcc_performance_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_performance_medicine_tenant ON p3dd_pcc_performance_medicine(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_performance_medicine_encounter ON p3dd_pcc_performance_medicine(encounter_id);

CREATE TABLE IF NOT EXISTS p3dd_pcc_occupational_rehab (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_occupational_rehab_tenant ON p3dd_pcc_occupational_rehab(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_occupational_rehab_encounter ON p3dd_pcc_occupational_rehab(encounter_id);
