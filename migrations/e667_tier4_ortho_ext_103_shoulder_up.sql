-- TIER4_ORTHO_EXT-103 Shoulder
CREATE TABLE IF NOT EXISTS tier4_ortho_ext_103_shoulder (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  full_thickness_tear BOOLEAN,
  surgical_candidate BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ortho_ext_103_shoulder ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ortho_ext_103_shoulder FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ortho_ext_103_shoulder_isolation ON tier4_ortho_ext_103_shoulder;
CREATE POLICY tier4_ortho_ext_103_shoulder_isolation ON tier4_ortho_ext_103_shoulder
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));