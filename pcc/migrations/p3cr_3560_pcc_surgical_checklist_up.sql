-- P3-CR module schema for pcc_surgical_checklist v3.56.0
CREATE TABLE IF NOT EXISTS p3cr_pcc_surgical_checklist (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cr_pcc_surgical_checklist_tenant ON p3cr_pcc_surgical_checklist(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cr_pcc_surgical_checklist_encounter ON p3cr_pcc_surgical_checklist(encounter_id);
