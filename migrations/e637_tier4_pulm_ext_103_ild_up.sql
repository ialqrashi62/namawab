-- TIER4_PULM_EXT-103 ILD
CREATE TABLE IF NOT EXISTS tier4_pulm_ext_103_ild (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  hrct_pattern TEXT,
  workup TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_pulm_ext_103_ild ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_pulm_ext_103_ild FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_pulm_ext_103_ild_isolation ON tier4_pulm_ext_103_ild;
CREATE POLICY tier4_pulm_ext_103_ild_isolation ON tier4_pulm_ext_103_ild
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));