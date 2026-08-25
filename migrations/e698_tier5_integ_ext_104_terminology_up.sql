-- TIER5_INTEG_EXT-104 Terminology
CREATE TABLE IF NOT EXISTS tier5_integ_ext_104_terminology (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  source_code TEXT,
  target_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_integ_ext_104_terminology ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_integ_ext_104_terminology FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_integ_ext_104_terminology_isolation ON tier5_integ_ext_104_terminology;
CREATE POLICY tier5_integ_ext_104_terminology_isolation ON tier5_integ_ext_104_terminology
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));