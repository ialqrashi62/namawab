-- TIER5_INTEG_EXT-101 CDS
CREATE TABLE IF NOT EXISTS tier5_integ_ext_101_cds (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  service_id TEXT,
  cards_count INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_integ_ext_101_cds ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_integ_ext_101_cds FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_integ_ext_101_cds_isolation ON tier5_integ_ext_101_cds;
CREATE POLICY tier5_integ_ext_101_cds_isolation ON tier5_integ_ext_101_cds
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));