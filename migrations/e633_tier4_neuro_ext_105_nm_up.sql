-- TIER4_NEURO_EXT-105 NM
CREATE TABLE IF NOT EXISTS tier4_neuro_ext_105_nm (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neuro_ext_105_nm ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neuro_ext_105_nm FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neuro_ext_105_nm_isolation ON tier4_neuro_ext_105_nm;
CREATE POLICY tier4_neuro_ext_105_nm_isolation ON tier4_neuro_ext_105_nm
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));