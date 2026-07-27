-- P3-DU module schema for pcc_ortho_sports_surgery v3.85.0
CREATE TABLE IF NOT EXISTS p3du_pcc_ortho_sports_surgery (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3du_pcc_ortho_sports_surgery_tenant ON p3du_pcc_ortho_sports_surgery(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3du_pcc_ortho_sports_surgery_encounter ON p3du_pcc_ortho_sports_surgery(encounter_id);
