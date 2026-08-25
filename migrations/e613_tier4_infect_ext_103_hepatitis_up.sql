-- TIER4_INFECT_EXT-103 Hepatitis
CREATE TABLE IF NOT EXISTS tier4_infect_ext_103_hepatitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  hbsag TEXT,
  hcv_ab TEXT,
  interpretation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_ext_103_hepatitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_ext_103_hepatitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_ext_103_hepatitis_isolation ON tier4_infect_ext_103_hepatitis;
CREATE POLICY tier4_infect_ext_103_hepatitis_isolation ON tier4_infect_ext_103_hepatitis
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));