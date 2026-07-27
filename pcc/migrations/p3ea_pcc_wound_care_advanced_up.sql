-- P3-EA module schema for pcc_wound_care_advanced v3.91.0
CREATE TABLE IF NOT EXISTS p3ea_pcc_wound_care_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_wound_care_advanced_tenant ON p3ea_pcc_wound_care_advanced(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ea_pcc_wound_care_advanced_encounter ON p3ea_pcc_wound_care_advanced(encounter_id);
