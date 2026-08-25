-- TIER4_HEMONC_EXT-103 Lymphoma
CREATE TABLE IF NOT EXISTS tier4_hemonc_ext_103_lymphoma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  type TEXT,
  stage TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hemonc_ext_103_lymphoma ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hemonc_ext_103_lymphoma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hemonc_ext_103_lymphoma_isolation ON tier4_hemonc_ext_103_lymphoma;
CREATE POLICY tier4_hemonc_ext_103_lymphoma_isolation ON tier4_hemonc_ext_103_lymphoma
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));