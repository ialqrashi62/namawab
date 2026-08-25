-- TIER5_GENOMICS_EXT-105 NBS
CREATE TABLE IF NOT EXISTS tier5_genomics_ext_105_nbs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  condition TEXT,
  action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_genomics_ext_105_nbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_genomics_ext_105_nbs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_genomics_ext_105_nbs_isolation ON tier5_genomics_ext_105_nbs;
CREATE POLICY tier5_genomics_ext_105_nbs_isolation ON tier5_genomics_ext_105_nbs
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));