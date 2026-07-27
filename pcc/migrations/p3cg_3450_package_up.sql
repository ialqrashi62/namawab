-- P3-CG package schema v3.45.0


CREATE SCHEMA IF NOT EXISTS p3cg;

CREATE TABLE IF NOT EXISTS p3cg_pcc_pharmacy (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cg_pcc_pharmacy_tenant ON p3cg_pcc_pharmacy(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cg_pcc_pharmacy_encounter ON p3cg_pcc_pharmacy(encounter_id);

CREATE TABLE IF NOT EXISTS p3cg_pcc_dialysis (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cg_pcc_dialysis_tenant ON p3cg_pcc_dialysis(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cg_pcc_dialysis_encounter ON p3cg_pcc_dialysis(encounter_id);

CREATE TABLE IF NOT EXISTS p3cg_pcc_oncology_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cg_pcc_oncology_ext_tenant ON p3cg_pcc_oncology_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cg_pcc_oncology_ext_encounter ON p3cg_pcc_oncology_ext(encounter_id);
