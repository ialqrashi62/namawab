CREATE TABLE IF NOT EXISTS addiction_med_harm (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_addiction_med_harm_t ON addiction_med_harm(tenant_id, patient_id);
ALTER TABLE addiction_med_harm ENABLE ROW LEVEL SECURITY;
ALTER TABLE addiction_med_harm FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_addiction_med_harm_t ON addiction_med_harm;
CREATE POLICY p_addiction_med_harm_t ON addiction_med_harm USING (tenant_id = current_setting('app.tenant_id', true));
