-- P3-DT package schema v3.84.0

CREATE SCHEMA IF NOT EXISTS p3dt;

CREATE TABLE IF NOT EXISTS p3dt_pcc_chest_pain_unit (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dt_pcc_chest_pain_unit_tenant ON p3dt_pcc_chest_pain_unit(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dt_pcc_chest_pain_unit_encounter ON p3dt_pcc_chest_pain_unit(encounter_id);


CREATE TABLE IF NOT EXISTS p3dt_pcc_psych_emergency (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dt_pcc_psych_emergency_tenant ON p3dt_pcc_psych_emergency(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dt_pcc_psych_emergency_encounter ON p3dt_pcc_psych_emergency(encounter_id);


CREATE TABLE IF NOT EXISTS p3dt_pcc_trauma_center_l2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dt_pcc_trauma_center_l2_tenant ON p3dt_pcc_trauma_center_l2(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dt_pcc_trauma_center_l2_encounter ON p3dt_pcc_trauma_center_l2(encounter_id);


