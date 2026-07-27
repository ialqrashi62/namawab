-- P3-CZ module schema for pcc_pain_rehab v3.64.0
CREATE TABLE IF NOT EXISTS p3cz_pcc_pain_rehab (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cz_pcc_pain_rehab_tenant ON p3cz_pcc_pain_rehab(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cz_pcc_pain_rehab_encounter ON p3cz_pcc_pain_rehab(encounter_id);
