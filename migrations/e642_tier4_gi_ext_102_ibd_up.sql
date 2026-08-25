-- TIER4_GI_EXT-102 IBD
CREATE TABLE IF NOT EXISTS tier4_gi_ext_102_ibd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  type TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_ext_102_ibd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_ext_102_ibd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_ext_102_ibd_isolation ON tier4_gi_ext_102_ibd;
CREATE POLICY tier4_gi_ext_102_ibd_isolation ON tier4_gi_ext_102_ibd
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));