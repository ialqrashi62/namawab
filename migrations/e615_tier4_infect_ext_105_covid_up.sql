-- TIER4_INFECT_EXT-105 COVID
CREATE TABLE IF NOT EXISTS tier4_infect_ext_105_covid (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  classification TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_ext_105_covid ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_ext_105_covid FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_ext_105_covid_isolation ON tier4_infect_ext_105_covid;
CREATE POLICY tier4_infect_ext_105_covid_isolation ON tier4_infect_ext_105_covid
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));