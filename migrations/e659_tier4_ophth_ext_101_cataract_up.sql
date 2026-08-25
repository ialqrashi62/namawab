-- TIER4_OPHTH_EXT-101 Cataract
CREATE TABLE IF NOT EXISTS tier4_ophth_ext_101_cataract (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  visual_acuity NUMERIC,
  severity TEXT,
  surgery_indicated TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_ext_101_cataract ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_ext_101_cataract FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_ext_101_cataract_isolation ON tier4_ophth_ext_101_cataract;
CREATE POLICY tier4_ophth_ext_101_cataract_isolation ON tier4_ophth_ext_101_cataract
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));