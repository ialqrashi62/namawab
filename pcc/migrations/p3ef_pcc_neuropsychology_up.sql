-- P3-EF module schema for pcc_neuropsychology v3.96.0
CREATE TABLE IF NOT EXISTS p3ef_pcc_neuropsychology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ef_pcc_neuropsychology_tenant ON p3ef_pcc_neuropsychology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ef_pcc_neuropsychology_encounter ON p3ef_pcc_neuropsychology(encounter_id);
