CREATE TABLE IF NOT EXISTS surg_spec_vascular (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_surg_spec_vascular_t ON surg_spec_vascular(tenant_id, patient_id);
ALTER TABLE surg_spec_vascular ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_spec_vascular FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_surg_spec_vascular_t ON surg_spec_vascular;
CREATE POLICY p_surg_spec_vascular_t ON surg_spec_vascular USING (tenant_id = current_setting('app.tenant_id', true));
