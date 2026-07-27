-- P3-EE package schema v3.95.0

CREATE SCHEMA IF NOT EXISTS p3ee;

CREATE TABLE IF NOT EXISTS p3ee_pcc_neuroendocrine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_neuroendocrine_tenant ON p3ee_pcc_neuroendocrine(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_neuroendocrine_encounter ON p3ee_pcc_neuroendocrine(encounter_id);


CREATE TABLE IF NOT EXISTS p3ee_pcc_pediatric_neuro (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_pediatric_neuro_tenant ON p3ee_pcc_pediatric_neuro(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_pediatric_neuro_encounter ON p3ee_pcc_pediatric_neuro(encounter_id);


CREATE TABLE IF NOT EXISTS p3ee_pcc_adolescent_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_adolescent_medicine_tenant ON p3ee_pcc_adolescent_medicine(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_adolescent_medicine_encounter ON p3ee_pcc_adolescent_medicine(encounter_id);


