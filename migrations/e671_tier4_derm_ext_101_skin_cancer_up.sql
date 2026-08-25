-- TIER4_DERM_EXT-101 Skin Cancer
CREATE TABLE IF NOT EXISTS tier4_derm_ext_101_skin_cancer (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  abcde_count INT,
  biopsy_indicated BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_derm_ext_101_skin_cancer ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_derm_ext_101_skin_cancer FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_derm_ext_101_skin_cancer_isolation ON tier4_derm_ext_101_skin_cancer;
CREATE POLICY tier4_derm_ext_101_skin_cancer_isolation ON tier4_derm_ext_101_skin_cancer
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));