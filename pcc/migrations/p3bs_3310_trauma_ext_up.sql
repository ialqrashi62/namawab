-- P3-BS module schema for trauma_ext v3.31.0
CREATE TABLE IF NOT EXISTS p3bs_trauma_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3bs_trauma_ext_tenant ON p3bs_trauma_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3bs_trauma_ext_encounter ON p3bs_trauma_ext(encounter_id);
