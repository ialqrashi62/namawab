-- P3-BR module schema for radiology2 v3.30.0
CREATE TABLE IF NOT EXISTS p3br_radiology2 (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3br_radiology2_tenant ON p3br_radiology2(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3br_radiology2_encounter ON p3br_radiology2(encounter_id);
