-- TIER4_PULM_EXT-105 PE
CREATE TABLE IF NOT EXISTS tier4_pulm_ext_105_pe (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  classification TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_ext_105_pe ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_ext_105_pe FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_ext_105_pe_isolation ON tier4_pulm_ext_105_pe;
CREATE POLICY tier4_pulm_ext_105_pe_isolation ON tier4_pulm_ext_105_pe
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));