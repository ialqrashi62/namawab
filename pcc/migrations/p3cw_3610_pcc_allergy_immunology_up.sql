-- P3-CW module schema for pcc_allergy_immunology v3.61.0
CREATE TABLE IF NOT EXISTS p3cw_pcc_allergy_immunology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cw_pcc_allergy_immunology_tenant ON p3cw_pcc_allergy_immunology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cw_pcc_allergy_immunology_encounter ON p3cw_pcc_allergy_immunology(encounter_id);
