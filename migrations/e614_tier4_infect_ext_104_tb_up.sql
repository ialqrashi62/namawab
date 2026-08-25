-- TIER4_INFECT_EXT-104 TB
CREATE TABLE IF NOT EXISTS tier4_infect_ext_104_tb (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  age INT,
  high_risk BOOLEAN,
  recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_ext_104_tb ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_ext_104_tb FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_ext_104_tb_isolation ON tier4_infect_ext_104_tb;
CREATE POLICY tier4_infect_ext_104_tb_isolation ON tier4_infect_ext_104_tb
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));