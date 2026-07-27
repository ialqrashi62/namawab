-- P3-BT module schema for obgyn_ext2 v3.32.0
CREATE TABLE IF NOT EXISTS p3bt_obgyn_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3bt_obgyn_ext2_tenant ON p3bt_obgyn_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3bt_obgyn_ext2_encounter ON p3bt_obgyn_ext2(encounter_id);
