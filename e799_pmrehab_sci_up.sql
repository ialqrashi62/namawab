CREATE TABLE IF NOT EXISTS pmrehab_sci (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pmrehab_sci_t ON pmrehab_sci(tenant_id, patient_id);
ALTER TABLE pmrehab_sci ENABLE ROW LEVEL SECURITY;
ALTER TABLE pmrehab_sci FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_pmrehab_sci_t ON pmrehab_sci;
CREATE POLICY p_pmrehab_sci_t ON pmrehab_sci USING (tenant_id = current_setting('app.tenant_id', true));
