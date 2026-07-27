-- P3-CI module schema for pcc_path_ext v3.47.0
CREATE TABLE IF NOT EXISTS p3ci_pcc_path_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ci_pcc_path_ext_tenant ON p3ci_pcc_path_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ci_pcc_path_ext_encounter ON p3ci_pcc_path_ext(encounter_id);
