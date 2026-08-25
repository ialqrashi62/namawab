-- filepath: e718_tier5_rehab_ext_106_peds_rehab_up.sql
CREATE TABLE IF NOT EXISTS peds_rehab (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_months INT NOT NULL,
  gmfs_level TEXT NOT NULL,
  classification TEXT NOT NULL,
  evaluated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_peds_r_t ON peds_rehab(tenant_id, age_months);
ALTER TABLE peds_rehab ENABLE ROW LEVEL SECURITY;
ALTER TABLE peds_rehab FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p_peds_r_t ON peds_rehab;
CREATE POLICY p_peds_r_t ON peds_rehab USING (tenant_id = current_setting('app.tenant_id', true));
