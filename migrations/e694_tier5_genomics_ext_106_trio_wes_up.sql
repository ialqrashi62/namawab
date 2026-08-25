-- TIER5_GENOMICS_EXT-106 Trio WES
CREATE TABLE IF NOT EXISTS tier5_genomics_ext_106_trio_wes (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  test_choice TEXT,
  interpretation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_genomics_ext_106_trio_wes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_genomics_ext_106_trio_wes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_genomics_ext_106_trio_wes_isolation ON tier5_genomics_ext_106_trio_wes;
CREATE POLICY tier5_genomics_ext_106_trio_wes_isolation ON tier5_genomics_ext_106_trio_wes
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));