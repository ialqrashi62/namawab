-- P3-DL module schema for pcc_critical_care_advanced v3.76.0
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
