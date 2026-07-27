-- P3-DZ module schema for pcc_thoracic_oncology v3.90.0
CREATE TABLE IF NOT EXISTS p3dz_pcc_thoracic_oncology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dz_pcc_thoracic_oncology_tenant ON p3dz_pcc_thoracic_oncology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dz_pcc_thoracic_oncology_encounter ON p3dz_pcc_thoracic_oncology(encounter_id);
