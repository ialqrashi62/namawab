-- P3-CZ package schema v3.64.0


CREATE SCHEMA IF NOT EXISTS p3cz;

CREATE TABLE IF NOT EXISTS p3cz_pcc_rehab_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cz_pcc_rehab_medicine_tenant ON p3cz_pcc_rehab_medicine(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cz_pcc_rehab_medicine_encounter ON p3cz_pcc_rehab_medicine(encounter_id);

CREATE TABLE IF NOT EXISTS p3cz_pcc_pain_rehab (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cz_pcc_pain_rehab_tenant ON p3cz_pcc_pain_rehab(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cz_pcc_pain_rehab_encounter ON p3cz_pcc_pain_rehab(encounter_id);

CREATE TABLE IF NOT EXISTS p3cz_pcc_geriatric_surgery (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cz_pcc_geriatric_surgery_tenant ON p3cz_pcc_geriatric_surgery(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cz_pcc_geriatric_surgery_encounter ON p3cz_pcc_geriatric_surgery(encounter_id);
