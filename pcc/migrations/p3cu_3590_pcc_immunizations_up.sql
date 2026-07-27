-- P3-CU module schema for pcc_immunizations v3.59.0
CREATE TABLE IF NOT EXISTS p3cu_pcc_immunizations (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cu_pcc_immunizations_tenant ON p3cu_pcc_immunizations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cu_pcc_immunizations_encounter ON p3cu_pcc_immunizations(encounter_id);
