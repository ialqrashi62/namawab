-- P3-DQ package schema v3.81.0


CREATE SCHEMA IF NOT EXISTS p3dq;

CREATE TABLE IF NOT EXISTS p3dq_pcc_dermatology_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dq_pcc_dermatology_advanced_tenant ON p3dq_pcc_dermatology_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dq_pcc_dermatology_advanced_encounter ON p3dq_pcc_dermatology_advanced(encounter_id);

CREATE TABLE IF NOT EXISTS p3dq_pcc_pediatrics_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dq_pcc_pediatrics_advanced_tenant ON p3dq_pcc_pediatrics_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dq_pcc_pediatrics_advanced_encounter ON p3dq_pcc_pediatrics_advanced(encounter_id);

CREATE TABLE IF NOT EXISTS p3dq_pcc_neonatology_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dq_pcc_neonatology_advanced_tenant ON p3dq_pcc_neonatology_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dq_pcc_neonatology_advanced_encounter ON p3dq_pcc_neonatology_advanced(encounter_id);
