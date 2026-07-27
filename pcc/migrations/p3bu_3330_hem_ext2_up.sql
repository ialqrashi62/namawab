-- P3-BU module schema for hem_ext2 v3.33.0
CREATE TABLE IF NOT EXISTS p3bu_hem_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3bu_hem_ext2_tenant ON p3bu_hem_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3bu_hem_ext2_encounter ON p3bu_hem_ext2(encounter_id);
