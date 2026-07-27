-- P3-ED module schema for pcc_dental_advanced v3.94.0
CREATE TABLE IF NOT EXISTS p3ed_pcc_dental_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ed_pcc_dental_advanced_tenant ON p3ed_pcc_dental_advanced(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ed_pcc_dental_advanced_encounter ON p3ed_pcc_dental_advanced(encounter_id);
