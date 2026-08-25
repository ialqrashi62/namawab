CREATE TABLE IF NOT EXISTS home_telehealth (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  condition TEXT NOT NULL,
  rpm_status TEXT NOT NULL,
  observed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ht_t ON home_telehealth(tenant_id, condition);
ALTER TABLE home_telehealth ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_telehealth FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_ht_t ON home_telehealth;
CREATE POLICY p_ht_t ON home_telehealth USING (tenant_id = current_setting('app.tenant_id', true));
