-- TIER4_HEMONC_EXT-106 Anticoag
CREATE TABLE IF NOT EXISTS tier4_hemonc_ext_106_anticoag (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  doac TEXT,
  intervention TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hemonc_ext_106_anticoag ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hemonc_ext_106_anticoag FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hemonc_ext_106_anticoag_isolation ON tier4_hemonc_ext_106_anticoag;
CREATE POLICY tier4_hemonc_ext_106_anticoag_isolation ON tier4_hemonc_ext_106_anticoag
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));