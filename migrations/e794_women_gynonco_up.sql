CREATE TABLE IF NOT EXISTS women_gynonco (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_women_gynonco_t ON women_gynonco(tenant_id, patient_id);
ALTER TABLE women_gynonco ENABLE ROW LEVEL SECURITY;
ALTER TABLE women_gynonco FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_women_gynonco_t ON women_gynonco;
CREATE POLICY p_women_gynonco_t ON women_gynonco USING (tenant_id = current_setting('app.tenant_id', true));
