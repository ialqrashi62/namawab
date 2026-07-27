-- P3-DP module schema for pcc_immunology_advanced v3.80.0
CREATE TABLE IF NOT EXISTS p3dp_pcc_immunology_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dp_pcc_immunology_advanced_tenant ON p3dp_pcc_immunology_advanced(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dp_pcc_immunology_advanced_encounter ON p3dp_pcc_immunology_advanced(encounter_id);
