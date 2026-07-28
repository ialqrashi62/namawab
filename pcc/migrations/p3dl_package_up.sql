-- P3-DL package schema v3.76.0


CREATE SCHEMA IF NOT EXISTS p3dl;

CREATE TABLE IF NOT EXISTS p3dl_pcc_critical_care_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dl_pcc_critical_care_advanced_tenant ON p3dl_pcc_critical_care_advanced(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dl_pcc_critical_care_advanced_encounter ON p3dl_pcc_critical_care_advanced(encounter_id);

CREATE TABLE IF NOT EXISTS p3dl_pcc_nutrition_support (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dl_pcc_nutrition_support_tenant ON p3dl_pcc_nutrition_support(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dl_pcc_nutrition_support_encounter ON p3dl_pcc_nutrition_support(encounter_id);

CREATE TABLE IF NOT EXISTS p3dl_pcc_sedation_analgesia (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_p3dl_pcc_sedation_analgesia_tenant ON p3dl_pcc_sedation_analgesia(tenant_id);

CREATE INDEX IF NOT EXISTS idx_p3dl_pcc_sedation_analgesia_encounter ON p3dl_pcc_sedation_analgesia(encounter_id);
