-- TIER4_INFECT_EXT-106 Antimicrobial
CREATE TABLE IF NOT EXISTS tier4_infect_ext_106_antimicrobial (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  antibiotic TEXT,
  indication TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_infect_ext_106_antimicrobial ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_infect_ext_106_antimicrobial FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_infect_ext_106_antimicrobial_isolation ON tier4_infect_ext_106_antimicrobial;
CREATE POLICY tier4_infect_ext_106_antimicrobial_isolation ON tier4_infect_ext_106_antimicrobial
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));