-- P3-CQ module schema for pcc_social_work v3.55.0
CREATE TABLE IF NOT EXISTS p3cq_pcc_social_work (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cq_pcc_social_work_tenant ON p3cq_pcc_social_work(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cq_pcc_social_work_encounter ON p3cq_pcc_social_work(encounter_id);
