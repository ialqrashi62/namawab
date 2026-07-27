-- P3-CZ module schema for pcc_geriatric_surgery v3.64.0
CREATE TABLE IF NOT EXISTS p3cz_pcc_geriatric_surgery (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cz_pcc_geriatric_surgery_tenant ON p3cz_pcc_geriatric_surgery(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cz_pcc_geriatric_surgery_encounter ON p3cz_pcc_geriatric_surgery(encounter_id);
