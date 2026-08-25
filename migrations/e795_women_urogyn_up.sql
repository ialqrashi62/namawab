CREATE TABLE IF NOT EXISTS women_urogyn (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_women_urogyn_t ON women_urogyn(tenant_id, patient_id);
ALTER TABLE women_urogyn ENABLE ROW LEVEL SECURITY;
ALTER TABLE women_urogyn FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_women_urogyn_t ON women_urogyn;
CREATE POLICY p_women_urogyn_t ON women_urogyn USING (tenant_id = current_setting('app.tenant_id', true));
