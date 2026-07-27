-- P3-CG module schema for pcc_pharmacy v3.45.0
CREATE TABLE IF NOT EXISTS p3cg_pcc_pharmacy (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3cg_pcc_pharmacy_tenant ON p3cg_pcc_pharmacy(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3cg_pcc_pharmacy_encounter ON p3cg_pcc_pharmacy(encounter_id);
