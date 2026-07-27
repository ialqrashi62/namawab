-- P3-CE package schema v3.43.0


CREATE SCHEMA IF NOT EXISTS p3ce;

CREATE TABLE IF NOT EXISTS p3ce_pcc_quality (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ce_pcc_quality_tenant ON p3ce_pcc_quality(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ce_pcc_quality_encounter ON p3ce_pcc_quality(encounter_id);

CREATE TABLE IF NOT EXISTS p3ce_pcc_research (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ce_pcc_research_tenant ON p3ce_pcc_research(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ce_pcc_research_encounter ON p3ce_pcc_research(encounter_id);

CREATE TABLE IF NOT EXISTS p3ce_pcc_education (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3ce_pcc_education_tenant ON p3ce_pcc_education(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3ce_pcc_education_encounter ON p3ce_pcc_education(encounter_id);
