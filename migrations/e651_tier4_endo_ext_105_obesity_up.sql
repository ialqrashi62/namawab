-- TIER4_ENDO_EXT-105 Obesity
CREATE TABLE IF NOT EXISTS tier4_endo_ext_105_obesity (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  bmi NUMERIC,
  category TEXT,
  bariatric_indicated BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_ext_105_obesity ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_ext_105_obesity FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_ext_105_obesity_isolation ON tier4_endo_ext_105_obesity;
CREATE POLICY tier4_endo_ext_105_obesity_isolation ON tier4_endo_ext_105_obesity
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));