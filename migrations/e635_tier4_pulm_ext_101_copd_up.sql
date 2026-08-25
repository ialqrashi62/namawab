-- TIER4_PULM_EXT-101 COPD
CREATE TABLE IF NOT EXISTS tier4_pulm_ext_101_copd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  fev1_pct INT,
  gold_stage TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_ext_101_copd ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_ext_101_copd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_ext_101_copd_isolation ON tier4_pulm_ext_101_copd;
CREATE POLICY tier4_pulm_ext_101_copd_isolation ON tier4_pulm_ext_101_copd
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));