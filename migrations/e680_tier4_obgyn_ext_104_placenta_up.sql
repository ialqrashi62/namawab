-- TIER4_OBGYN_EXT-104 Placenta
CREATE TABLE IF NOT EXISTS tier4_obgyn_ext_104_placenta (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  type TEXT,
  delivery TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_obgyn_ext_104_placenta ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_obgyn_ext_104_placenta FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_obgyn_ext_104_placenta_isolation ON tier4_obgyn_ext_104_placenta;
CREATE POLICY tier4_obgyn_ext_104_placenta_isolation ON tier4_obgyn_ext_104_placenta
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));