CREATE TABLE IF NOT EXISTS lab_mol (nid BIGSERIAL PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id TEXT NOT NULL, record_date DATE NOT NULL DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE INDEX IF NOT EXISTS idx_lab_mol_t ON lab_mol(tenant_id, patient_id);
ALTER TABLE lab_mol ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_mol FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_lab_mol_t ON lab_mol;
CREATE POLICY p_lab_mol_t ON lab_mol USING (tenant_id = current_setting('app.tenant_id', true));