-- P3-DT module schema for pcc_psych_emergency v3.84.0
CREATE TABLE IF NOT EXISTS p3dt_pcc_psych_emergency (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3dt_pcc_psych_emergency_tenant ON p3dt_pcc_psych_emergency(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3dt_pcc_psych_emergency_encounter ON p3dt_pcc_psych_emergency(encounter_id);
