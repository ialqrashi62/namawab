-- P3-DI package schema v3.73.0


CREATE SCHEMA IF NOT EXISTS p3di;

CREATE TABLE IF NOT EXISTS p3di_pcc_cardiovascular_optimization (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3di_pcc_cardiovascular_optimization_tenant ON p3di_pcc_cardiovascular_optimization(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3di_pcc_cardiovascular_optimization_encounter ON p3di_pcc_cardiovascular_optimization(encounter_id);

CREATE TABLE IF NOT EXISTS p3di_pcc_vascular_health (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3di_pcc_vascular_health_tenant ON p3di_pcc_vascular_health(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3di_pcc_vascular_health_encounter ON p3di_pcc_vascular_health(encounter_id);

CREATE TABLE IF NOT EXISTS p3di_pcc_heart_failure_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3di_pcc_heart_failure_advanced_tenant ON p3di_pcc_heart_failure_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3di_pcc_heart_failure_advanced_encounter ON p3di_pcc_heart_failure_advanced(encounter_id);
