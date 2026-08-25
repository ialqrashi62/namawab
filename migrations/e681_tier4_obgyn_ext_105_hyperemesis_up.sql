-- TIER4_OBGYN_EXT-105 Hyperemesis
CREATE TABLE IF NOT EXISTS tier4_obgyn_ext_105_hyperemesis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  severity TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_obgyn_ext_105_hyperemesis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_obgyn_ext_105_hyperemesis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_obgyn_ext_105_hyperemesis_isolation ON tier4_obgyn_ext_105_hyperemesis;
CREATE POLICY tier4_obgyn_ext_105_hyperemesis_isolation ON tier4_obgyn_ext_105_hyperemesis
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));