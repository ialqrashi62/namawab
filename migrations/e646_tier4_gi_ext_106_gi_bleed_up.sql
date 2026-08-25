-- TIER4_GI_EXT-106 GI Bleed
CREATE TABLE IF NOT EXISTS tier4_gi_ext_106_gi_bleed (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  localization TEXT,
  risk TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_ext_106_gi_bleed ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_ext_106_gi_bleed FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_ext_106_gi_bleed_isolation ON tier4_gi_ext_106_gi_bleed;
CREATE POLICY tier4_gi_ext_106_gi_bleed_isolation ON tier4_gi_ext_106_gi_bleed
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));