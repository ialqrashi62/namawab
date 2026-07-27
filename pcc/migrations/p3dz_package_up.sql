-- P3-DZ package schema v3.90.0

CREATE SCHEMA IF NOT EXISTS p3dz;

CREATE TABLE IF NOT EXISTS p3dz_pcc_neuro_ophthalmology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dz_pcc_neuro_ophthalmology_tenant ON p3dz_pcc_neuro_ophthalmology(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dz_pcc_neuro_ophthalmology_encounter ON p3dz_pcc_neuro_ophthalmology(encounter_id);


CREATE TABLE IF NOT EXISTS p3dz_pcc_thoracic_oncology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dz_pcc_thoracic_oncology_tenant ON p3dz_pcc_thoracic_oncology(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dz_pcc_thoracic_oncology_encounter ON p3dz_pcc_thoracic_oncology(encounter_id);


CREATE TABLE IF NOT EXISTS p3dz_pcc_breast_imaging (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dz_pcc_breast_imaging_tenant ON p3dz_pcc_breast_imaging(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dz_pcc_breast_imaging_encounter ON p3dz_pcc_breast_imaging(encounter_id);


