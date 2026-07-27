-- P3-DE module schema for pcc_nutritional_medicine v3.69.0
CREATE TABLE IF NOT EXISTS p3de_pcc_nutritional_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3de_pcc_nutritional_medicine_tenant ON p3de_pcc_nutritional_medicine(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3de_pcc_nutritional_medicine_encounter ON p3de_pcc_nutritional_medicine(encounter_id);
