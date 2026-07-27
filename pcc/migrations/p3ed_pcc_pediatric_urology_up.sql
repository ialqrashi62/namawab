-- P3-ED module schema for pcc_pediatric_urology v3.94.0
CREATE TABLE IF NOT EXISTS p3ed_pcc_pediatric_urology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ed_pcc_pediatric_urology_tenant ON p3ed_pcc_pediatric_urology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ed_pcc_pediatric_urology_encounter ON p3ed_pcc_pediatric_urology(encounter_id);
