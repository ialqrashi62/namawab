-- TIER4_NEPH_EXT-103 Transplant
CREATE TABLE IF NOT EXISTS tier4_neph_ext_103_transplant (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  eligible BOOLEAN,
  donor_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_ext_103_transplant ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_ext_103_transplant FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_ext_103_transplant_isolation ON tier4_neph_ext_103_transplant;
CREATE POLICY tier4_neph_ext_103_transplant_isolation ON tier4_neph_ext_103_transplant
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));