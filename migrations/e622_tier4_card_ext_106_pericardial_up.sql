-- TIER4_CARD_EXT-106 Pericardial
CREATE TABLE IF NOT EXISTS tier4_card_ext_106_pericardial (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_card_ext_106_pericardial ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_card_ext_106_pericardial FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_card_ext_106_pericardial_isolation ON tier4_card_ext_106_pericardial;
CREATE POLICY tier4_card_ext_106_pericardial_isolation ON tier4_card_ext_106_pericardial
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));