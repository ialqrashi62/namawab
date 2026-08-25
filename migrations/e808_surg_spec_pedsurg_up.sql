CREATE TABLE IF NOT EXISTS surg_spec_pedsurg (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_surg_spec_pedsurg_t ON surg_spec_pedsurg(tenant_id, patient_id);
ALTER TABLE surg_spec_pedsurg ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_spec_pedsurg FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_surg_spec_pedsurg_t ON surg_spec_pedsurg;
CREATE POLICY p_surg_spec_pedsurg_t ON surg_spec_pedsurg USING (tenant_id = current_setting('app.tenant_id', true));
