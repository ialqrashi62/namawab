CREATE TABLE IF NOT EXISTS women_reproendo (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_women_reproendo_t ON women_reproendo(tenant_id, patient_id);
ALTER TABLE women_reproendo ENABLE ROW LEVEL SECURITY;
ALTER TABLE women_reproendo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_women_reproendo_t ON women_reproendo;
CREATE POLICY p_women_reproendo_t ON women_reproendo USING (tenant_id = current_setting('app.tenant_id', true));
