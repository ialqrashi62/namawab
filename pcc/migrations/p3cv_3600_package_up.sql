-- P3-CV package schema v3.60.0


CREATE SCHEMA IF NOT EXISTS p3cv;

CREATE TABLE IF NOT EXISTS p3cv_pcc_palliative (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_palliative_tenant ON p3cv_pcc_palliative(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_palliative_encounter ON p3cv_pcc_palliative(encounter_id);

CREATE TABLE IF NOT EXISTS p3cv_pcc_pain_mgmt (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_pain_mgmt_tenant ON p3cv_pcc_pain_mgmt(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_pain_mgmt_encounter ON p3cv_pcc_pain_mgmt(encounter_id);

CREATE TABLE IF NOT EXISTS p3cv_pcc_sports_med (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_sports_med_tenant ON p3cv_pcc_sports_med(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_sports_med_encounter ON p3cv_pcc_sports_med(encounter_id);
