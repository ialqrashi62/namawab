-- TIER4_GI_EXT-101 GERD
CREATE TABLE IF NOT EXISTS tier4_gi_ext_101_gerd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  alarm_features BOOLEAN,
  chronic BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_ext_101_gerd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_ext_101_gerd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_ext_101_gerd_isolation ON tier4_gi_ext_101_gerd;
CREATE POLICY tier4_gi_ext_101_gerd_isolation ON tier4_gi_ext_101_gerd
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));