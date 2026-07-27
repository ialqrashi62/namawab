-- P3-EE module schema for pcc_adolescent_medicine v3.95.0
CREATE TABLE IF NOT EXISTS p3ee_pcc_adolescent_medicine (
    id BIGSERIAL PRIMARY KEY,
    encounter_id TEXT,
    tenant_id TEXT NOT NULL,
    input JSONB,
    result JSONB,
    module TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_adolescent_medicine_tenant ON p3ee_pcc_adolescent_medicine(tenant_id);
CREATE INDEX IF NOT EXISTS idx_p3ee_pcc_adolescent_medicine_encounter ON p3ee_pcc_adolescent_medicine(encounter_id);
