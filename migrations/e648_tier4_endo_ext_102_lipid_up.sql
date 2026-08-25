-- TIER4_ENDO_EXT-102 Lipid
CREATE TABLE IF NOT EXISTS tier4_endo_ext_102_lipid (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  total_cholesterol INT,
  ldl INT,
  intensity TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_ext_102_lipid ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_ext_102_lipid FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_ext_102_lipid_isolation ON tier4_endo_ext_102_lipid;
CREATE POLICY tier4_endo_ext_102_lipid_isolation ON tier4_endo_ext_102_lipid
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));