-- P3-DH module schema for pcc_cognitive_enhancement v3.72.0
CREATE TABLE IF NOT EXISTS p3dh_pcc_cognitive_enhancement (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dh_pcc_cognitive_enhancement_tenant ON p3dh_pcc_cognitive_enhancement(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dh_pcc_cognitive_enhancement_encounter ON p3dh_pcc_cognitive_enhancement(encounter_id);
