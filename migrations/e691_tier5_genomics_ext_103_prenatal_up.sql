-- TIER5_GENOMICS_EXT-103 Prenatal
CREATE TABLE IF NOT EXISTS tier5_genomics_ext_103_prenatal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  positive_screen BOOLEAN,
  screening_choice TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_genomics_ext_103_prenatal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_genomics_ext_103_prenatal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_genomics_ext_103_prenatal_isolation ON tier5_genomics_ext_103_prenatal;
CREATE POLICY tier5_genomics_ext_103_prenatal_isolation ON tier5_genomics_ext_103_prenatal
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));