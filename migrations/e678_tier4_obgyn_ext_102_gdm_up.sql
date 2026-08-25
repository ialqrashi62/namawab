-- TIER4_OBGYN_EXT-102 GDM
CREATE TABLE IF NOT EXISTS tier4_obgyn_ext_102_gdm (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  gdm_diagnosis BOOLEAN,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_obgyn_ext_102_gdm ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_obgyn_ext_102_gdm FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_obgyn_ext_102_gdm_isolation ON tier4_obgyn_ext_102_gdm;
CREATE POLICY tier4_obgyn_ext_102_gdm_isolation ON tier4_obgyn_ext_102_gdm
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));