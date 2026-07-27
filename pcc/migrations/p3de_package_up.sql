-- P3-DE package schema v3.69.0


CREATE SCHEMA IF NOT EXISTS p3de;

CREATE TABLE IF NOT EXISTS p3de_pcc_nutritional_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3de_pcc_nutritional_medicine_tenant ON p3de_pcc_nutritional_medicine(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3de_pcc_nutritional_medicine_encounter ON p3de_pcc_nutritional_medicine(encounter_id);

CREATE TABLE IF NOT EXISTS p3de_pcc_gut_microbiome (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3de_pcc_gut_microbiome_tenant ON p3de_pcc_gut_microbiome(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3de_pcc_gut_microbiome_encounter ON p3de_pcc_gut_microbiome(encounter_id);

CREATE TABLE IF NOT EXISTS p3de_pcc_metabolic_health (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3de_pcc_metabolic_health_tenant ON p3de_pcc_metabolic_health(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3de_pcc_metabolic_health_encounter ON p3de_pcc_metabolic_health(encounter_id);
