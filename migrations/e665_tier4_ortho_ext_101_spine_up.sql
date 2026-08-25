-- TIER4_ORTHO_EXT-101 Spine
CREATE TABLE IF NOT EXISTS tier4_ortho_ext_101_spine (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  red_flags_count INT,
  cauda BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ortho_ext_101_spine ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ortho_ext_101_spine FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ortho_ext_101_spine_isolation ON tier4_ortho_ext_101_spine;
CREATE POLICY tier4_ortho_ext_101_spine_isolation ON tier4_ortho_ext_101_spine
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));