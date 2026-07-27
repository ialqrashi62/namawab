-- P3-CY package schema v3.63.0


CREATE SCHEMA IF NOT EXISTS p3cy;

CREATE TABLE IF NOT EXISTS p3cy_pcc_travel_med (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cy_pcc_travel_med_tenant ON p3cy_pcc_travel_med(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cy_pcc_travel_med_encounter ON p3cy_pcc_travel_med(encounter_id);

CREATE TABLE IF NOT EXISTS p3cy_pcc_genetic_counseling (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cy_pcc_genetic_counseling_tenant ON p3cy_pcc_genetic_counseling(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cy_pcc_genetic_counseling_encounter ON p3cy_pcc_genetic_counseling(encounter_id);

CREATE TABLE IF NOT EXISTS p3cy_pcc_wound_care_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3cy_pcc_wound_care_ext_tenant ON p3cy_pcc_wound_care_ext(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3cy_pcc_wound_care_ext_encounter ON p3cy_pcc_wound_care_ext(encounter_id);
