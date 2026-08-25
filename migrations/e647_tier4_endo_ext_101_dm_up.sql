-- TIER4_ENDO_EXT-101 DM
CREATE TABLE IF NOT EXISTS tier4_endo_ext_101_dm (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  fbg INT,
  a1c NUMERIC,
  dka_protocol TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_ext_101_dm ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_ext_101_dm FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_ext_101_dm_isolation ON tier4_endo_ext_101_dm;
CREATE POLICY tier4_endo_ext_101_dm_isolation ON tier4_endo_ext_101_dm
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));