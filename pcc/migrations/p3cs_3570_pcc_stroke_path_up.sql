-- P3-CS module schema for pcc_stroke_path v3.57.0
CREATE TABLE IF NOT EXISTS p3cs_pcc_stroke_path (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cs_pcc_stroke_path_tenant ON p3cs_pcc_stroke_path(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cs_pcc_stroke_path_encounter ON p3cs_pcc_stroke_path(encounter_id);
