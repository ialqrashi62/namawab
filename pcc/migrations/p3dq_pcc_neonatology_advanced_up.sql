-- P3-DQ module schema for pcc_neonatology_advanced v3.81.0
CREATE TABLE IF NOT EXISTS p3dq_pcc_neonatology_advanced (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dq_pcc_neonatology_advanced_tenant ON p3dq_pcc_neonatology_advanced(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dq_pcc_neonatology_advanced_encounter ON p3dq_pcc_neonatology_advanced(encounter_id);
