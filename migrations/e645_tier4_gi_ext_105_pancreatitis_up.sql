-- TIER4_GI_EXT-105 Pancreatitis
CREATE TABLE IF NOT EXISTS tier4_gi_ext_105_pancreatitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  severity TEXT,
  cause TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_ext_105_pancreatitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_ext_105_pancreatitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_ext_105_pancreatitis_isolation ON tier4_gi_ext_105_pancreatitis;
CREATE POLICY tier4_gi_ext_105_pancreatitis_isolation ON tier4_gi_ext_105_pancreatitis
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));