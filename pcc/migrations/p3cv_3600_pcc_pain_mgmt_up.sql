-- P3-CV module schema for pcc_pain_mgmt v3.60.0
CREATE TABLE IF NOT EXISTS p3cv_pcc_pain_mgmt (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_pain_mgmt_tenant ON p3cv_pcc_pain_mgmt(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cv_pcc_pain_mgmt_encounter ON p3cv_pcc_pain_mgmt(encounter_id);
