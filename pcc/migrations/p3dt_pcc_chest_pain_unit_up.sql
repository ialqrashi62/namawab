-- P3-DT module schema for pcc_chest_pain_unit v3.84.0
CREATE TABLE IF NOT EXISTS p3dt_pcc_chest_pain_unit (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dt_pcc_chest_pain_unit_tenant ON p3dt_pcc_chest_pain_unit(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dt_pcc_chest_pain_unit_encounter ON p3dt_pcc_chest_pain_unit(encounter_id);
