-- P3-BW module schema for repro_ext v3.35.0
CREATE TABLE IF NOT EXISTS p3bw_repro_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3bw_repro_ext_tenant ON p3bw_repro_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3bw_repro_ext_encounter ON p3bw_repro_ext(encounter_id);
