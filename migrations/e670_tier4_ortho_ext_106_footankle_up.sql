-- TIER4_ORTHO_EXT-106 Foot/Ankle
CREATE TABLE IF NOT EXISTS tier4_ortho_ext_106_footankle (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  diagnosis TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ortho_ext_106_footankle ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ortho_ext_106_footankle FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ortho_ext_106_footankle_isolation ON tier4_ortho_ext_106_footankle;
CREATE POLICY tier4_ortho_ext_106_footankle_isolation ON tier4_ortho_ext_106_footankle
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));