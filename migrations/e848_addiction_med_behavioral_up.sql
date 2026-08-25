CREATE TABLE IF NOT EXISTS addiction_med_behavioral (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_addiction_med_behavioral_t ON addiction_med_behavioral(tenant_id, patient_id);
ALTER TABLE addiction_med_behavioral ENABLE ROW LEVEL SECURITY;
ALTER TABLE addiction_med_behavioral FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_addiction_med_behavioral_t ON addiction_med_behavioral;
CREATE POLICY p_addiction_med_behavioral_t ON addiction_med_behavioral USING (tenant_id = current_setting('app.tenant_id', true));
