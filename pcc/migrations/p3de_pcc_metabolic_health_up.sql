-- P3-DE module schema for pcc_metabolic_health v3.69.0
CREATE TABLE IF NOT EXISTS p3de_pcc_metabolic_health (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3de_pcc_metabolic_health_tenant ON p3de_pcc_metabolic_health(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3de_pcc_metabolic_health_encounter ON p3de_pcc_metabolic_health(encounter_id);
