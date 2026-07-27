-- P3-DE module schema for pcc_gut_microbiome v3.69.0
CREATE TABLE IF NOT EXISTS p3de_pcc_gut_microbiome (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3de_pcc_gut_microbiome_tenant ON p3de_pcc_gut_microbiome(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3de_pcc_gut_microbiome_encounter ON p3de_pcc_gut_microbiome(encounter_id);
