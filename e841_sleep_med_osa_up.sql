CREATE TABLE IF NOT EXISTS sleep_med_osa (
  nid BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sleep_med_osa_t ON sleep_med_osa(tenant_id, patient_id);
ALTER TABLE sleep_med_osa ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_med_osa FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_sleep_med_osa_t ON sleep_med_osa;
CREATE POLICY p_sleep_med_osa_t ON sleep_med_osa USING (tenant_id = current_setting('app.tenant_id', true));
