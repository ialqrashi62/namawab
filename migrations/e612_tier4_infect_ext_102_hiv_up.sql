-- TIER4_INFECT_EXT-102 HIV
CREATE TABLE IF NOT EXISTS tier4_infect_ext_102_hiv (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  age INT,
  pregnant BOOLEAN,
  cd4 INT,
  viral_load INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_ext_102_hiv ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_ext_102_hiv FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_ext_102_hiv_isolation ON tier4_infect_ext_102_hiv;
CREATE POLICY tier4_infect_ext_102_hiv_isolation ON tier4_infect_ext_102_hiv
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));