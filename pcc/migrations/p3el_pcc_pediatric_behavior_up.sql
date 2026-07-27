-- P3-EL module schema for pcc_pediatric_behavior v3.102.0
CREATE TABLE IF NOT EXISTS p3el_pcc_pediatric_behavior (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3el_pcc_pediatric_behavior_tenant ON p3el_pcc_pediatric_behavior(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3el_pcc_pediatric_behavior_encounter ON p3el_pcc_pediatric_behavior(encounter_id);
