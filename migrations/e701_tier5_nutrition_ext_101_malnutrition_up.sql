-- TIER5_NUTRITION_EXT-101 Malnutrition
CREATE TABLE IF NOT EXISTS tier5_nutrition_ext_101_malnutrition (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  mst_score INT,
  at_risk BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_nutrition_ext_101_malnutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_nutrition_ext_101_malnutrition FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_nutrition_ext_101_malnutrition_isolation ON tier5_nutrition_ext_101_malnutrition;
CREATE POLICY tier5_nutrition_ext_101_malnutrition_isolation ON tier5_nutrition_ext_101_malnutrition
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));