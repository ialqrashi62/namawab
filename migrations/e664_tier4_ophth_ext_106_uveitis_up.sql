-- TIER4_OPHTH_EXT-106 Uveitis
CREATE TABLE IF NOT EXISTS tier4_ophth_ext_106_uveitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  location TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_ext_106_uveitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_ext_106_uveitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_ext_106_uveitis_isolation ON tier4_ophth_ext_106_uveitis;
CREATE POLICY tier4_ophth_ext_106_uveitis_isolation ON tier4_ophth_ext_106_uveitis
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));