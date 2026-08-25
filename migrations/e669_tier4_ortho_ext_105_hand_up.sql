-- TIER4_ORTHO_EXT-105 Hand
CREATE TABLE IF NOT EXISTS tier4_ortho_ext_105_hand (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ortho_ext_105_hand ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ortho_ext_105_hand FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ortho_ext_105_hand_isolation ON tier4_ortho_ext_105_hand;
CREATE POLICY tier4_ortho_ext_105_hand_isolation ON tier4_ortho_ext_105_hand
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));