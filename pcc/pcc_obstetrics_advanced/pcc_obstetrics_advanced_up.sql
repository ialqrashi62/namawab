-- P3-DR module schema for pcc_obstetrics_advanced v3.82.0
CREATE TABLE IF NOT EXISTS p3dr_pcc_obstetrics_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dr_pcc_obstetrics_advanced_tenant ON p3dr_pcc_obstetrics_advanced(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dr_pcc_obstetrics_advanced_encounter ON p3dr_pcc_obstetrics_advanced(encounter_id);
