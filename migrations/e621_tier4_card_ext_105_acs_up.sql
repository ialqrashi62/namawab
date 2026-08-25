-- TIER4_CARD_EXT-105 ACS
CREATE TABLE IF NOT EXISTS tier4_card_ext_105_acs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  classification TEXT,
  strategy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_card_ext_105_acs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_card_ext_105_acs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_card_ext_105_acs_isolation ON tier4_card_ext_105_acs;
CREATE POLICY tier4_card_ext_105_acs_isolation ON tier4_card_ext_105_acs
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));