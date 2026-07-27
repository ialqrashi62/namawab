-- P3-EP module schema for pcc_pediatric_surg_oncology v3.106.0
CREATE TABLE IF NOT EXISTS p3ep_pcc_pediatric_surg_oncology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_pediatric_surg_oncology_tenant ON p3ep_pcc_pediatric_surg_oncology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ep_pcc_pediatric_surg_oncology_encounter ON p3ep_pcc_pediatric_surg_oncology(encounter_id);
