-- TIER5_INTEG_EXT-105 Care Plan
CREATE TABLE IF NOT EXISTS tier5_integ_ext_105_careplan (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  goals_count INT,
  interventions_count INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_integ_ext_105_careplan ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_integ_ext_105_careplan FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_integ_ext_105_careplan_isolation ON tier5_integ_ext_105_careplan;
CREATE POLICY tier5_integ_ext_105_careplan_isolation ON tier5_integ_ext_105_careplan
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));