-- P3-CO module schema for pcc_ophth_ext2 v3.53.0
CREATE TABLE IF NOT EXISTS p3co_pcc_ophth_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3co_pcc_ophth_ext2_tenant ON p3co_pcc_ophth_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3co_pcc_ophth_ext2_encounter ON p3co_pcc_ophth_ext2(encounter_id);
