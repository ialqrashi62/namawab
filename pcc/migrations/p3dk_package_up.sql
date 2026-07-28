-- P3-DK package schema v3.75.0


CREATE SCHEMA IF NOT EXISTS p3dk;

CREATE TABLE IF NOT EXISTS p3dk_pcc_pulmonary_rehabilitation (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dk_pcc_pulmonary_rehabilitation_tenant ON p3dk_pcc_pulmonary_rehabilitation(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dk_pcc_pulmonary_rehabilitation_encounter ON p3dk_pcc_pulmonary_rehabilitation(encounter_id);

CREATE TABLE IF NOT EXISTS p3dk_pcc_thoracic_surgery (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dk_pcc_thoracic_surgery_tenant ON p3dk_pcc_thoracic_surgery(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dk_pcc_thoracic_surgery_encounter ON p3dk_pcc_thoracic_surgery(encounter_id);

CREATE TABLE IF NOT EXISTS p3dk_pcc_respiratory_therapy (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dk_pcc_respiratory_therapy_tenant ON p3dk_pcc_respiratory_therapy(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dk_pcc_respiratory_therapy_encounter ON p3dk_pcc_respiratory_therapy(encounter_id);
