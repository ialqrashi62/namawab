-- P3-EH package schema v3.98.0

CREATE SCHEMA IF NOT EXISTS p3eh;

CREATE TABLE IF NOT EXISTS p3eh_pcc_voice_swallowing (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_voice_swallowing_tenant ON p3eh_pcc_voice_swallowing(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_voice_swallowing_encounter ON p3eh_pcc_voice_swallowing(encounter_id);


CREATE TABLE IF NOT EXISTS p3eh_pcc_pediatric_rheum (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_pediatric_rheum_tenant ON p3eh_pcc_pediatric_rheum(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_pediatric_rheum_encounter ON p3eh_pcc_pediatric_rheum(encounter_id);


CREATE TABLE IF NOT EXISTS p3eh_pcc_pediatric_gi_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_pediatric_gi_ext_tenant ON p3eh_pcc_pediatric_gi_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_pediatric_gi_ext_encounter ON p3eh_pcc_pediatric_gi_ext(encounter_id);


