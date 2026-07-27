-- P3-EM module schema for pcc_pediatric_rehab v3.103.0
CREATE TABLE IF NOT EXISTS p3em_pcc_pediatric_rehab (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3em_pcc_pediatric_rehab_tenant ON p3em_pcc_pediatric_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3em_pcc_pediatric_rehab_encounter ON p3em_pcc_pediatric_rehab(encounter_id);
