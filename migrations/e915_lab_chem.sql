CREATE TABLE IF NOT EXISTS lab_chem (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_lab_chem_t ON lab_chem(tenant_id, patient_id);
ALTER TABLE lab_chem ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_chem FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_lab_chem_t ON lab_chem;
CREATE POLICY p_lab_chem_t ON lab_chem USING (tenant_id = current_setting('app.tenant_id', true));