-- TIER4_PULM_EXT-106 Pneumonia
CREATE TABLE IF NOT EXISTS tier4_pulm_ext_106_pneumonia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  curb65 INT,
  severity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_ext_106_pneumonia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_ext_106_pneumonia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_ext_106_pneumonia_isolation ON tier4_pulm_ext_106_pneumonia;
CREATE POLICY tier4_pulm_ext_106_pneumonia_isolation ON tier4_pulm_ext_106_pneumonia
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));