-- P3-EG module schema for pcc_neurotology v3.97.0
CREATE TABLE IF NOT EXISTS p3eg_pcc_neurotology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3eg_pcc_neurotology_tenant ON p3eg_pcc_neurotology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3eg_pcc_neurotology_encounter ON p3eg_pcc_neurotology(encounter_id);
