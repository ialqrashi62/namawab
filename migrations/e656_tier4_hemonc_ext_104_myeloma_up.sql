-- TIER4_HEMONC_EXT-104 Myeloma
CREATE TABLE IF NOT EXISTS tier4_hemonc_ext_104_myeloma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  diagnosis TEXT,
  stage TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hemonc_ext_104_myeloma ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hemonc_ext_104_myeloma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hemonc_ext_104_myeloma_isolation ON tier4_hemonc_ext_104_myeloma;
CREATE POLICY tier4_hemonc_ext_104_myeloma_isolation ON tier4_hemonc_ext_104_myeloma
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));