-- TIER4_CARD_EXT-104 CAD
CREATE TABLE IF NOT EXISTS tier4_card_ext_104_cad (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  risk_points INT,
  ten_year_risk TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_card_ext_104_cad ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_card_ext_104_cad FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_card_ext_104_cad_isolation ON tier4_card_ext_104_cad;
CREATE POLICY tier4_card_ext_104_cad_isolation ON tier4_card_ext_104_cad
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));