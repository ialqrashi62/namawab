CREATE TABLE IF NOT EXISTS women_meno (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_women_meno_t ON women_meno(tenant_id, patient_id);
ALTER TABLE women_meno ENABLE ROW LEVEL SECURITY;
ALTER TABLE women_meno FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_women_meno_t ON women_meno;
CREATE POLICY p_women_meno_t ON women_meno USING (tenant_id = current_setting('app.tenant_id', true));
