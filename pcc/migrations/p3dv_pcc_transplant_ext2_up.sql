-- P3-DV module schema for pcc_transplant_ext2 v3.86.0
CREATE TABLE IF NOT EXISTS p3dv_pcc_transplant_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dv_pcc_transplant_ext2_tenant ON p3dv_pcc_transplant_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dv_pcc_transplant_ext2_encounter ON p3dv_pcc_transplant_ext2(encounter_id);
