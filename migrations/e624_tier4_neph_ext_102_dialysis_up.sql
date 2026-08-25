-- TIER4_NEPH_EXT-102 Dialysis
CREATE TABLE IF NOT EXISTS tier4_neph_ext_102_dialysis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  kt_v NUMERIC,
  modality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_neph_ext_102_dialysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_neph_ext_102_dialysis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_neph_ext_102_dialysis_isolation ON tier4_neph_ext_102_dialysis;
CREATE POLICY tier4_neph_ext_102_dialysis_isolation ON tier4_neph_ext_102_dialysis
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));