-- TIER4_GI_EXT-103 IBS
CREATE TABLE IF NOT EXISTS tier4_gi_ext_103_ibs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  subtype TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_ext_103_ibs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_ext_103_ibs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_ext_103_ibs_isolation ON tier4_gi_ext_103_ibs;
CREATE POLICY tier4_gi_ext_103_ibs_isolation ON tier4_gi_ext_103_ibs
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));