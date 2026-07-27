-- P3-CH package schema v3.46.0


CREATE SCHEMA IF NOT EXISTS p3ch;

CREATE TABLE IF NOT EXISTS p3ch_pcc_surgical_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ch_pcc_surgical_ext_tenant ON p3ch_pcc_surgical_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ch_pcc_surgical_ext_encounter ON p3ch_pcc_surgical_ext(encounter_id);

CREATE TABLE IF NOT EXISTS p3ch_pcc_perioperative (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ch_pcc_perioperative_tenant ON p3ch_pcc_perioperative(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ch_pcc_perioperative_encounter ON p3ch_pcc_perioperative(encounter_id);

CREATE TABLE IF NOT EXISTS p3ch_pcc_postop (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ch_pcc_postop_tenant ON p3ch_pcc_postop(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ch_pcc_postop_encounter ON p3ch_pcc_postop(encounter_id);
