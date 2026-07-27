-- P3-CF module schema for pcc_scheduling v3.44.0
CREATE TABLE IF NOT EXISTS p3cf_pcc_scheduling (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cf_pcc_scheduling_tenant ON p3cf_pcc_scheduling(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cf_pcc_scheduling_encounter ON p3cf_pcc_scheduling(encounter_id);
