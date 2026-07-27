-- P3-EF module schema for pcc_pediatric_nephrology v3.96.0
CREATE TABLE IF NOT EXISTS p3ef_pcc_pediatric_nephrology (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ef_pcc_pediatric_nephrology_tenant ON p3ef_pcc_pediatric_nephrology(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ef_pcc_pediatric_nephrology_encounter ON p3ef_pcc_pediatric_nephrology(encounter_id);
