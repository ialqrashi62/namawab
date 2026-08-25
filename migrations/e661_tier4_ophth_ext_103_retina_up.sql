-- TIER4_OPHTH_EXT-103 Retina
CREATE TABLE IF NOT EXISTS tier4_ophth_ext_103_retina (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  dr_stage TEXT,
  amd_class TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_ext_103_retina ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_ext_103_retina FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_ext_103_retina_isolation ON tier4_ophth_ext_103_retina;
CREATE POLICY tier4_ophth_ext_103_retina_isolation ON tier4_ophth_ext_103_retina
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));