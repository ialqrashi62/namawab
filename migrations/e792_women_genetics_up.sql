CREATE TABLE IF NOT EXISTS women_genetics (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_women_genetics_t ON women_genetics(tenant_id, patient_id);
ALTER TABLE women_genetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE women_genetics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_women_genetics_t ON women_genetics;
CREATE POLICY p_women_genetics_t ON women_genetics USING (tenant_id = current_setting('app.tenant_id', true));
