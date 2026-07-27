-- P3-DP package schema v3.80.0


CREATE SCHEMA IF NOT EXISTS p3dp;

CREATE TABLE IF NOT EXISTS p3dp_pcc_rheumatology_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dp_pcc_rheumatology_advanced_tenant ON p3dp_pcc_rheumatology_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dp_pcc_rheumatology_advanced_encounter ON p3dp_pcc_rheumatology_advanced(encounter_id);

CREATE TABLE IF NOT EXISTS p3dp_pcc_immunology_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dp_pcc_immunology_advanced_tenant ON p3dp_pcc_immunology_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dp_pcc_immunology_advanced_encounter ON p3dp_pcc_immunology_advanced(encounter_id);

CREATE TABLE IF NOT EXISTS p3dp_pcc_allergy_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dp_pcc_allergy_advanced_tenant ON p3dp_pcc_allergy_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dp_pcc_allergy_advanced_encounter ON p3dp_pcc_allergy_advanced(encounter_id);
