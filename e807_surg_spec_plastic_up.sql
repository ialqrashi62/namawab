CREATE TABLE IF NOT EXISTS surg_spec_plastic (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_surg_spec_plastic_t ON surg_spec_plastic(tenant_id, patient_id);
ALTER TABLE surg_spec_plastic ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_spec_plastic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_surg_spec_plastic_t ON surg_spec_plastic;
CREATE POLICY p_surg_spec_plastic_t ON surg_spec_plastic USING (tenant_id = current_setting('app.tenant_id', true));
