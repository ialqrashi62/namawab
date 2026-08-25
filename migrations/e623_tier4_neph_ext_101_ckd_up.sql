-- TIER4_NEPH_EXT-101 CKD
CREATE TABLE IF NOT EXISTS tier4_neph_ext_101_ckd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  egfr INT,
  ckd_stage TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_ext_101_ckd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_ext_101_ckd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_ext_101_ckd_isolation ON tier4_neph_ext_101_ckd;
CREATE POLICY tier4_neph_ext_101_ckd_isolation ON tier4_neph_ext_101_ckd
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));