-- TIER4_OPHTH_EXT-104 Cornea
CREATE TABLE IF NOT EXISTS tier4_ophth_ext_104_cornea (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  severity TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_ext_104_cornea ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_ext_104_cornea FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_ext_104_cornea_isolation ON tier4_ophth_ext_104_cornea;
CREATE POLICY tier4_ophth_ext_104_cornea_isolation ON tier4_ophth_ext_104_cornea
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));