-- P3-DS module schema for pcc_stroke_unit v3.83.0
CREATE TABLE IF NOT EXISTS p3ds_pcc_stroke_unit (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ds_pcc_stroke_unit_tenant ON p3ds_pcc_stroke_unit(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ds_pcc_stroke_unit_encounter ON p3ds_pcc_stroke_unit(encounter_id);
