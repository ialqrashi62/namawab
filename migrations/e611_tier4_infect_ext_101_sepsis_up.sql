-- TIER4_INFECT_EXT-101 Sepsis
CREATE TABLE IF NOT EXISTS tier4_infect_ext_101_sepsis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  resp_rate INT,
  sbp INT,
  mental_status INT,
  qsofa_score INT,
  high_risk BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_ext_101_sepsis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_ext_101_sepsis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_ext_101_sepsis_isolation ON tier4_infect_ext_101_sepsis;
CREATE POLICY tier4_infect_ext_101_sepsis_isolation ON tier4_infect_ext_101_sepsis
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));