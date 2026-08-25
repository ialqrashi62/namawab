-- TIER4_DERM_EXT-106 Nails
CREATE TABLE IF NOT EXISTS tier4_derm_ext_106_nails (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_derm_ext_106_nails ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_derm_ext_106_nails FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_derm_ext_106_nails_isolation ON tier4_derm_ext_106_nails;
CREATE POLICY tier4_derm_ext_106_nails_isolation ON tier4_derm_ext_106_nails
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));