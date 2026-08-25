-- TIER4_DERM_EXT-102 Psoriasis
CREATE TABLE IF NOT EXISTS tier4_derm_ext_102_psoriasis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  pasi NUMERIC,
  severity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_derm_ext_102_psoriasis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_derm_ext_102_psoriasis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_derm_ext_102_psoriasis_isolation ON tier4_derm_ext_102_psoriasis;
CREATE POLICY tier4_derm_ext_102_psoriasis_isolation ON tier4_derm_ext_102_psoriasis
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));