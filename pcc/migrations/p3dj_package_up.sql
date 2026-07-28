-- P3-DJ package schema v3.74.0


CREATE SCHEMA IF NOT EXISTS p3dj;

CREATE TABLE IF NOT EXISTS p3dj_pcc_pulmonary_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dj_pcc_pulmonary_advanced_tenant ON p3dj_pcc_pulmonary_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dj_pcc_pulmonary_advanced_encounter ON p3dj_pcc_pulmonary_advanced(encounter_id);

CREATE TABLE IF NOT EXISTS p3dj_pcc_sleep_disorders (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dj_pcc_sleep_disorders_tenant ON p3dj_pcc_sleep_disorders(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dj_pcc_sleep_disorders_encounter ON p3dj_pcc_sleep_disorders(encounter_id);

CREATE TABLE IF NOT EXISTS p3dj_pcc_allergy_environmental (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dj_pcc_allergy_environmental_tenant ON p3dj_pcc_allergy_environmental(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dj_pcc_allergy_environmental_encounter ON p3dj_pcc_allergy_environmental(encounter_id);
