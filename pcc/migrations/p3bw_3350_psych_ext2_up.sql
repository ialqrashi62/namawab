-- P3-BW module schema for psych_ext2 v3.35.0
CREATE TABLE IF NOT EXISTS p3bw_psych_ext2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3bw_psych_ext2_tenant ON p3bw_psych_ext2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3bw_psych_ext2_encounter ON p3bw_psych_ext2(encounter_id);
