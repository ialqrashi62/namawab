-- TIER4_HEMONC_EXT-105 Transfusion
CREATE TABLE IF NOT EXISTS tier4_hemonc_ext_105_transfusion (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  component TEXT,
  indication TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hemonc_ext_105_transfusion ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hemonc_ext_105_transfusion FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hemonc_ext_105_transfusion_isolation ON tier4_hemonc_ext_105_transfusion;
CREATE POLICY tier4_hemonc_ext_105_transfusion_isolation ON tier4_hemonc_ext_105_transfusion
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));