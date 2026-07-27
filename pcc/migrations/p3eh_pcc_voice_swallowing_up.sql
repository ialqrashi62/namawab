-- P3-EH module schema for pcc_voice_swallowing v3.98.0
CREATE TABLE IF NOT EXISTS p3eh_pcc_voice_swallowing (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_voice_swallowing_tenant ON p3eh_pcc_voice_swallowing(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3eh_pcc_voice_swallowing_encounter ON p3eh_pcc_voice_swallowing(encounter_id);
