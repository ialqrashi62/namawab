-- P3-DG module schema for pcc_adrenal_health v3.71.0
CREATE TABLE IF NOT EXISTS p3dg_pcc_adrenal_health (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dg_pcc_adrenal_health_tenant ON p3dg_pcc_adrenal_health(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dg_pcc_adrenal_health_encounter ON p3dg_pcc_adrenal_health(encounter_id);
