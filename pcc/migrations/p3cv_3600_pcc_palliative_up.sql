-- P3-CV module schema for pcc_palliative v3.60.0
CREATE TABLE IF NOT EXISTS p3cv_pcc_palliative (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_palliative_tenant ON p3cv_pcc_palliative(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_palliative_encounter ON p3cv_pcc_palliative(encounter_id);
