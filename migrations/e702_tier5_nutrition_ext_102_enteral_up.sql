-- TIER5_NUTRITION_EXT-102 Enteral
CREATE TABLE IF NOT EXISTS tier5_nutrition_ext_102_enteral (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  total_kcal INT,
  rate_ml_hour INT,
  formula TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_nutrition_ext_102_enteral ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_nutrition_ext_102_enteral FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_nutrition_ext_102_enteral_isolation ON tier5_nutrition_ext_102_enteral;
CREATE POLICY tier5_nutrition_ext_102_enteral_isolation ON tier5_nutrition_ext_102_enteral
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));