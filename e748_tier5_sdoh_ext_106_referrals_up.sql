CREATE TABLE IF NOT EXISTS sdoh_referrals (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  record_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sd106_t ON sdoh_referrals(tenant_id, patient_id);
ALTER TABLE sdoh_referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sdoh_referrals FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_sd106_t ON sdoh_referrals;
CREATE POLICY p_sd106_t ON sdoh_referrals USING (tenant_id = current_setting('app.tenant_id', true));
