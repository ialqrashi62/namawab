-- P3-CV module schema for pcc_sports_med v3.60.0
CREATE TABLE IF NOT EXISTS p3cv_pcc_sports_med (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_sports_med_tenant ON p3cv_pcc_sports_med(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_sports_med_encounter ON p3cv_pcc_sports_med(encounter_id);
