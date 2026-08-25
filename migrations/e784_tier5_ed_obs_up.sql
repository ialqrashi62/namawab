-- e784 tier5 ed obs
CREATE TABLE IF NOT EXISTS ed_obs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_eobs_t ON ed_obs(tenant_id, patient_id);
ALTER TABLE ed_obs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ed_obs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_eobs_t ON ed_obs;
CREATE POLICY p_eobs_t ON ed_obs USING (tenant_id = current_setting('app.tenant_id', true));
