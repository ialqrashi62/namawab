-- TIER5_GENOMICS_EXT-101 BRCA
CREATE TABLE IF NOT EXISTS tier5_genomics_ext_101_brca (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  meets_test_criteria BOOLEAN,
  panel TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_genomics_ext_101_brca ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_genomics_ext_101_brca FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_genomics_ext_101_brca_isolation ON tier5_genomics_ext_101_brca;
CREATE POLICY tier5_genomics_ext_101_brca_isolation ON tier5_genomics_ext_101_brca
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));