-- TIER4_NEPH_EXT-106 GN
CREATE TABLE IF NOT EXISTS tier4_neph_ext_106_gn (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  syndrome TEXT,
  biopsy_indicated BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_ext_106_gn ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_ext_106_gn FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_ext_106_gn_isolation ON tier4_neph_ext_106_gn;
CREATE POLICY tier4_neph_ext_106_gn_isolation ON tier4_neph_ext_106_gn
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));