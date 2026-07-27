-- P3-CU module schema for pcc_cancer_screen v3.59.0
CREATE TABLE IF NOT EXISTS p3cu_pcc_cancer_screen (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cu_pcc_cancer_screen_tenant ON p3cu_pcc_cancer_screen(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cu_pcc_cancer_screen_encounter ON p3cu_pcc_cancer_screen(encounter_id);
