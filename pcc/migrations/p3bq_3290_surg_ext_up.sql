-- P3-BQ module schema for surg_ext v3.29.0
CREATE TABLE IF NOT EXISTS p3bq_surg_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3bq_surg_ext_tenant ON p3bq_surg_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3bq_surg_ext_encounter ON p3bq_surg_ext(encounter_id);
