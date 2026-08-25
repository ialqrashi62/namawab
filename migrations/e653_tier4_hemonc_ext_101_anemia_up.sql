-- TIER4_HEMONC_EXT-101 Anemia
CREATE TABLE IF NOT EXISTS tier4_hemonc_ext_101_anemia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  hgb NUMERIC,
  type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hemonc_ext_101_anemia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hemonc_ext_101_anemia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hemonc_ext_101_anemia_isolation ON tier4_hemonc_ext_101_anemia;
CREATE POLICY tier4_hemonc_ext_101_anemia_isolation ON tier4_hemonc_ext_101_anemia
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));