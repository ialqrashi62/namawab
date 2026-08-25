-- TIER4_ORTHO_EXT-104 Hip
CREATE TABLE IF NOT EXISTS tier4_ortho_ext_104_hip (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  hoos INT,
  tha_candidate BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ortho_ext_104_hip ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ortho_ext_104_hip FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ortho_ext_104_hip_isolation ON tier4_ortho_ext_104_hip;
CREATE POLICY tier4_ortho_ext_104_hip_isolation ON tier4_ortho_ext_104_hip
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));