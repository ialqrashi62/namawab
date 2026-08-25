CREATE TABLE IF NOT EXISTS ed_trauma (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ed_trauma_t ON ed_trauma(tenant_id, patient_id);
ALTER TABLE ed_trauma ENABLE ROW LEVEL SECURITY;
ALTER TABLE ed_trauma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ed_trauma_t ON ed_trauma;
CREATE POLICY p_ed_trauma_t ON ed_trauma USING (tenant_id = current_setting('app.tenant_id', true));
