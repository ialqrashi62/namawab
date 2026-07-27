-- P3-DF package schema v3.70.0


CREATE SCHEMA IF NOT EXISTS p3df;

CREATE TABLE IF NOT EXISTS p3df_pcc_immune_health (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3df_pcc_immune_health_tenant ON p3df_pcc_immune_health(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3df_pcc_immune_health_encounter ON p3df_pcc_immune_health(encounter_id);

CREATE TABLE IF NOT EXISTS p3df_pcc_allergy_precision (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3df_pcc_allergy_precision_tenant ON p3df_pcc_allergy_precision(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3df_pcc_allergy_precision_encounter ON p3df_pcc_allergy_precision(encounter_id);

CREATE TABLE IF NOT EXISTS p3df_pcc_inflammation (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3df_pcc_inflammation_tenant ON p3df_pcc_inflammation(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3df_pcc_inflammation_encounter ON p3df_pcc_inflammation(encounter_id);
