-- TIER5_GENOMICS_EXT-104 Carrier
CREATE TABLE IF NOT EXISTS tier5_genomics_ext_104_carrier (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  recommendation TEXT,
  partner_screening TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_genomics_ext_104_carrier ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_genomics_ext_104_carrier FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_genomics_ext_104_carrier_isolation ON tier5_genomics_ext_104_carrier;
CREATE POLICY tier5_genomics_ext_104_carrier_isolation ON tier5_genomics_ext_104_carrier
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));