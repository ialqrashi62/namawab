CREATE TABLE IF NOT EXISTS ed_triage (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ed_triage_t ON ed_triage(tenant_id, patient_id);
ALTER TABLE ed_triage ENABLE ROW LEVEL SECURITY;
ALTER TABLE ed_triage FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ed_triage_t ON ed_triage;
CREATE POLICY p_ed_triage_t ON ed_triage USING (tenant_id = current_setting('app.tenant_id', true));
