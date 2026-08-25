-- TIER4_ORTHO_EXT-102 Knee
CREATE TABLE IF NOT EXISTS tier4_ortho_ext_102_knee (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  kl_grade INT,
  tka_candidate BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ortho_ext_102_knee ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ortho_ext_102_knee FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ortho_ext_102_knee_isolation ON tier4_ortho_ext_102_knee;
CREATE POLICY tier4_ortho_ext_102_knee_isolation ON tier4_ortho_ext_102_knee
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));