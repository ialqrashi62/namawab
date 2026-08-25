-- TIER4_NEPH_EXT-105 AKI
CREATE TABLE IF NOT EXISTS tier4_neph_ext_105_aki (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  stage TEXT,
  etiology TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_ext_105_aki ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_ext_105_aki FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_ext_105_aki_isolation ON tier4_neph_ext_105_aki;
CREATE POLICY tier4_neph_ext_105_aki_isolation ON tier4_neph_ext_105_aki
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));