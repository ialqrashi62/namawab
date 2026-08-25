-- TIER4_DERM_EXT-105 Hair
CREATE TABLE IF NOT EXISTS tier4_derm_ext_105_hair (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  type TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_derm_ext_105_hair ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_derm_ext_105_hair FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_derm_ext_105_hair_isolation ON tier4_derm_ext_105_hair;
CREATE POLICY tier4_derm_ext_105_hair_isolation ON tier4_derm_ext_105_hair
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));