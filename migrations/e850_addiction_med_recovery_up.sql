CREATE TABLE IF NOT EXISTS addiction_med_recovery (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_addiction_med_recovery_t ON addiction_med_recovery(tenant_id, patient_id);
ALTER TABLE addiction_med_recovery ENABLE ROW LEVEL SECURITY;
ALTER TABLE addiction_med_recovery FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_addiction_med_recovery_t ON addiction_med_recovery;
CREATE POLICY p_addiction_med_recovery_t ON addiction_med_recovery USING (tenant_id = current_setting('app.tenant_id', true));
