-- TIER4_ENDO_EXT-103 Thyroid
CREATE TABLE IF NOT EXISTS tier4_endo_ext_103_thyroid (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  tsh NUMERIC,
  tirads TEXT,
  fnab_indicated BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_ext_103_thyroid ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_ext_103_thyroid FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_ext_103_thyroid_isolation ON tier4_endo_ext_103_thyroid;
CREATE POLICY tier4_endo_ext_103_thyroid_isolation ON tier4_endo_ext_103_thyroid
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));