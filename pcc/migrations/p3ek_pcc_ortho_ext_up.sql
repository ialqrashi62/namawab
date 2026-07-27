-- P3-EK module schema for pcc_ortho_ext v3.101.0
CREATE TABLE IF NOT EXISTS p3ek_pcc_ortho_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ek_pcc_ortho_ext_tenant ON p3ek_pcc_ortho_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ek_pcc_ortho_ext_encounter ON p3ek_pcc_ortho_ext(encounter_id);
