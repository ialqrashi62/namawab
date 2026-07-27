-- P3-DU module schema for pcc_pain_procedure_suite v3.85.0
CREATE TABLE IF NOT EXISTS p3du_pcc_pain_procedure_suite (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3du_pcc_pain_procedure_suite_tenant ON p3du_pcc_pain_procedure_suite(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3du_pcc_pain_procedure_suite_encounter ON p3du_pcc_pain_procedure_suite(encounter_id);
