-- TIER4_DERM_EXT-104 Acne
CREATE TABLE IF NOT EXISTS tier4_derm_ext_104_acne (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  severity TEXT,
  scarring BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_derm_ext_104_acne ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_derm_ext_104_acne FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_derm_ext_104_acne_isolation ON tier4_derm_ext_104_acne;
CREATE POLICY tier4_derm_ext_104_acne_isolation ON tier4_derm_ext_104_acne
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));