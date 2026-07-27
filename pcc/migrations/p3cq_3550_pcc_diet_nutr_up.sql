-- P3-CQ module schema for pcc_diet_nutr v3.55.0
CREATE TABLE IF NOT EXISTS p3cq_pcc_diet_nutr (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cq_pcc_diet_nutr_tenant ON p3cq_pcc_diet_nutr(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cq_pcc_diet_nutr_encounter ON p3cq_pcc_diet_nutr(encounter_id);
