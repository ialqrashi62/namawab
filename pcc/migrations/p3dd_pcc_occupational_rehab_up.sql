-- P3-DD module schema for pcc_occupational_rehab v3.68.0
CREATE TABLE IF NOT EXISTS p3dd_pcc_occupational_rehab (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_occupational_rehab_tenant ON p3dd_pcc_occupational_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dd_pcc_occupational_rehab_encounter ON p3dd_pcc_occupational_rehab(encounter_id);
