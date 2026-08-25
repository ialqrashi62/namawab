-- TIER4_DERM_EXT-103 Eczema
CREATE TABLE IF NOT EXISTS tier4_derm_ext_103_eczema (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  iGA_score INT,
  severity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_derm_ext_103_eczema ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_derm_ext_103_eczema FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_derm_ext_103_eczema_isolation ON tier4_derm_ext_103_eczema;
CREATE POLICY tier4_derm_ext_103_eczema_isolation ON tier4_derm_ext_103_eczema
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));