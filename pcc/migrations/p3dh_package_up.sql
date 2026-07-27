-- P3-DH package schema v3.72.0


CREATE SCHEMA IF NOT EXISTS p3dh;

CREATE TABLE IF NOT EXISTS p3dh_pcc_brain_health (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dh_pcc_brain_health_tenant ON p3dh_pcc_brain_health(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dh_pcc_brain_health_encounter ON p3dh_pcc_brain_health(encounter_id);

CREATE TABLE IF NOT EXISTS p3dh_pcc_cognitive_enhancement (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dh_pcc_cognitive_enhancement_tenant ON p3dh_pcc_cognitive_enhancement(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dh_pcc_cognitive_enhancement_encounter ON p3dh_pcc_cognitive_enhancement(encounter_id);

CREATE TABLE IF NOT EXISTS p3dh_pcc_mental_resilience (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dh_pcc_mental_resilience_tenant ON p3dh_pcc_mental_resilience(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dh_pcc_mental_resilience_encounter ON p3dh_pcc_mental_resilience(encounter_id);
