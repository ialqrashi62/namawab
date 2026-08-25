CREATE TABLE IF NOT EXISTS dental_oral (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dental_oral_t ON dental_oral(tenant_id, patient_id);
ALTER TABLE dental_oral ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_oral FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_dental_oral_t ON dental_oral;
CREATE POLICY p_dental_oral_t ON dental_oral USING (tenant_id = current_setting('app.tenant_id', true));
