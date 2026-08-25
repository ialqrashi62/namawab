-- TIER4_OPHTH_EXT-102 Glaucoma
CREATE TABLE IF NOT EXISTS tier4_ophth_ext_102_glaucoma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  iop NUMERIC,
  type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_ext_102_glaucoma ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_ext_102_glaucoma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_ext_102_glaucoma_isolation ON tier4_ophth_ext_102_glaucoma;
CREATE POLICY tier4_ophth_ext_102_glaucoma_isolation ON tier4_ophth_ext_102_glaucoma
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));