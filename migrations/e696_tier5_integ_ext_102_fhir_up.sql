-- TIER5_INTEG_EXT-102 FHIR
CREATE TABLE IF NOT EXISTS tier5_integ_ext_102_fhir (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_integ_ext_102_fhir ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_integ_ext_102_fhir FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_integ_ext_102_fhir_isolation ON tier5_integ_ext_102_fhir;
CREATE POLICY tier5_integ_ext_102_fhir_isolation ON tier5_integ_ext_102_fhir
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));