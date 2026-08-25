CREATE TABLE IF NOT EXISTS prehospital_ext_mci (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_prehospital_ext_mci_t ON prehospital_ext_mci(tenant_id, patient_id);
ALTER TABLE prehospital_ext_mci ENABLE ROW LEVEL SECURITY;
ALTER TABLE prehospital_ext_mci FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_prehospital_ext_mci_t ON prehospital_ext_mci;
CREATE POLICY p_prehospital_ext_mci_t ON prehospital_ext_mci USING (tenant_id = current_setting('app.tenant_id', true));
