-- TIER5_NUTRITION_EXT-105 Renal diet
CREATE TABLE IF NOT EXISTS tier5_nutrition_ext_105_renal_diet (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  ckd_stage TEXT,
  protein_g_per_day INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_nutrition_ext_105_renal_diet ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_nutrition_ext_105_renal_diet FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_nutrition_ext_105_renal_diet_isolation ON tier5_nutrition_ext_105_renal_diet;
CREATE POLICY tier5_nutrition_ext_105_renal_diet_isolation ON tier5_nutrition_ext_105_renal_diet
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));