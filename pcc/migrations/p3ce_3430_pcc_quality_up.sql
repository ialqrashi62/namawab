-- P3-CE module schema for pcc_quality v3.43.0
CREATE TABLE IF NOT EXISTS p3ce_pcc_quality (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ce_pcc_quality_tenant ON p3ce_pcc_quality(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ce_pcc_quality_encounter ON p3ce_pcc_quality(encounter_id);
