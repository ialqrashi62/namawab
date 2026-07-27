-- P3-DX module schema for pcc_vascular_intervention v3.88.0
CREATE TABLE IF NOT EXISTS p3dx_pcc_vascular_intervention (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dx_pcc_vascular_intervention_tenant ON p3dx_pcc_vascular_intervention(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dx_pcc_vascular_intervention_encounter ON p3dx_pcc_vascular_intervention(encounter_id);
