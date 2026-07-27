-- P3-BR module schema for pathology_ext v3.30.0
CREATE TABLE IF NOT EXISTS p3br_pathology_ext (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3br_pathology_ext_tenant ON p3br_pathology_ext(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3br_pathology_ext_encounter ON p3br_pathology_ext(encounter_id);
