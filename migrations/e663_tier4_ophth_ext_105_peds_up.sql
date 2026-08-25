-- TIER4_OPHTH_EXT-105 Peds
CREATE TABLE IF NOT EXISTS tier4_ophth_ext_105_peds (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  type TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_ophth_ext_105_peds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_ophth_ext_105_peds FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_ophth_ext_105_peds_isolation ON tier4_ophth_ext_105_peds;
CREATE POLICY tier4_ophth_ext_105_peds_isolation ON tier4_ophth_ext_105_peds
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));