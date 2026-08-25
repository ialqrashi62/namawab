CREATE TABLE IF NOT EXISTS dental_prostho (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_dental_prostho_t ON dental_prostho(tenant_id, patient_id);
ALTER TABLE dental_prostho ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_prostho FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_dental_prostho_t ON dental_prostho;
CREATE POLICY p_dental_prostho_t ON dental_prostho USING (tenant_id = current_setting('app.tenant_id', true));
