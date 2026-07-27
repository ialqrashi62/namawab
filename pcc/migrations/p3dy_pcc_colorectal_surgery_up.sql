-- P3-DY module schema for pcc_colorectal_surgery v3.89.0
CREATE TABLE IF NOT EXISTS p3dy_pcc_colorectal_surgery (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dy_pcc_colorectal_surgery_tenant ON p3dy_pcc_colorectal_surgery(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dy_pcc_colorectal_surgery_encounter ON p3dy_pcc_colorectal_surgery(encounter_id);
