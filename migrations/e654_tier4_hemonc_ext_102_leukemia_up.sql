-- TIER4_HEMONC_EXT-102 Leukemia
CREATE TABLE IF NOT EXISTS tier4_hemonc_ext_102_leukemia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  type TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hemonc_ext_102_leukemia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hemonc_ext_102_leukemia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hemonc_ext_102_leukemia_isolation ON tier4_hemonc_ext_102_leukemia;
CREATE POLICY tier4_hemonc_ext_102_leukemia_isolation ON tier4_hemonc_ext_102_leukemia
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));