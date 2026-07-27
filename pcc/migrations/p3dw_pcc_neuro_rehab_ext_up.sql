-- P3-DW module schema for pcc_neuro_rehab_ext v3.87.0
CREATE TABLE IF NOT EXISTS p3dw_pcc_neuro_rehab_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_neuro_rehab_ext_tenant ON p3dw_pcc_neuro_rehab_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dw_pcc_neuro_rehab_ext_encounter ON p3dw_pcc_neuro_rehab_ext(encounter_id);
