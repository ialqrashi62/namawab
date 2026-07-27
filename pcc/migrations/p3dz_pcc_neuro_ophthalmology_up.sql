-- P3-DZ module schema for pcc_neuro_ophthalmology v3.90.0
CREATE TABLE IF NOT EXISTS p3dz_pcc_neuro_ophthalmology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dz_pcc_neuro_ophthalmology_tenant ON p3dz_pcc_neuro_ophthalmology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dz_pcc_neuro_ophthalmology_encounter ON p3dz_pcc_neuro_ophthalmology(encounter_id);
