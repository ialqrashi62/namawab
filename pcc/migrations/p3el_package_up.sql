-- P3-EL package schema v3.102.0

CREATE SCHEMA IF NOT EXISTS p3el;

CREATE TABLE IF NOT EXISTS p3el_pcc_neuro_ext3 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3el_pcc_neuro_ext3_tenant ON p3el_pcc_neuro_ext3(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3el_pcc_neuro_ext3_encounter ON p3el_pcc_neuro_ext3(encounter_id);


CREATE TABLE IF NOT EXISTS p3el_pcc_pediatric_behavior (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3el_pcc_pediatric_behavior_tenant ON p3el_pcc_pediatric_behavior(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3el_pcc_pediatric_behavior_encounter ON p3el_pcc_pediatric_behavior(encounter_id);


CREATE TABLE IF NOT EXISTS p3el_pcc_pediatric_imaging (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3el_pcc_pediatric_imaging_tenant ON p3el_pcc_pediatric_imaging(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3el_pcc_pediatric_imaging_encounter ON p3el_pcc_pediatric_imaging(encounter_id);


