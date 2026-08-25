-- TIER4_NEURO_EXT-106 ALS
CREATE TABLE IF NOT EXISTS tier4_neuro_ext_106_als (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  classification TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neuro_ext_106_als ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neuro_ext_106_als FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neuro_ext_106_als_isolation ON tier4_neuro_ext_106_als;
CREATE POLICY tier4_neuro_ext_106_als_isolation ON tier4_neuro_ext_106_als
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));