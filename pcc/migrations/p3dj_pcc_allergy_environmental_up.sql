-- P3-DJ module schema for pcc_allergy_environmental v3.74.0
CREATE TABLE IF NOT EXISTS p3dj_pcc_allergy_environmental (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dj_pcc_allergy_environmental_tenant ON p3dj_pcc_allergy_environmental(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dj_pcc_allergy_environmental_encounter ON p3dj_pcc_allergy_environmental(encounter_id);
