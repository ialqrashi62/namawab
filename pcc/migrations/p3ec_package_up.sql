-- P3-EC package schema v3.93.0

CREATE SCHEMA IF NOT EXISTS p3ec;

CREATE TABLE IF NOT EXISTS p3ec_pcc_pediatric_cardiology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ec_pcc_pediatric_cardiology_tenant ON p3ec_pcc_pediatric_cardiology(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ec_pcc_pediatric_cardiology_encounter ON p3ec_pcc_pediatric_cardiology(encounter_id);


CREATE TABLE IF NOT EXISTS p3ec_pcc_psychogeriatrics (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ec_pcc_psychogeriatrics_tenant ON p3ec_pcc_psychogeriatrics(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ec_pcc_psychogeriatrics_encounter ON p3ec_pcc_psychogeriatrics(encounter_id);


CREATE TABLE IF NOT EXISTS p3ec_pcc_hand_surgery (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ec_pcc_hand_surgery_tenant ON p3ec_pcc_hand_surgery(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ec_pcc_hand_surgery_encounter ON p3ec_pcc_hand_surgery(encounter_id);


