-- TIER4_ENDO_EXT-106 Pituitary
CREATE TABLE IF NOT EXISTS tier4_endo_ext_106_pituitary (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  igf1 NUMERIC,
  prolactin INT,
  diagnosis TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_ext_106_pituitary ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_ext_106_pituitary FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_ext_106_pituitary_isolation ON tier4_endo_ext_106_pituitary;
CREATE POLICY tier4_endo_ext_106_pituitary_isolation ON tier4_endo_ext_106_pituitary
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));