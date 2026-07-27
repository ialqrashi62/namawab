-- P3-DD module schema for pcc_sports_science v3.68.0
CREATE TABLE IF NOT EXISTS p3dd_pcc_sports_science (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_sports_science_tenant ON p3dd_pcc_sports_science(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_sports_science_encounter ON p3dd_pcc_sports_science(encounter_id);
