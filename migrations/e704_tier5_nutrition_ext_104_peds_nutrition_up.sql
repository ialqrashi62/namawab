-- TIER5_NUTRITION_EXT-104 Peds nutrition
CREATE TABLE IF NOT EXISTS tier5_nutrition_ext_104_peds_nutrition (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  age_months INT,
  kcal_per_day INT,
  interpretation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_nutrition_ext_104_peds_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_nutrition_ext_104_peds_nutrition FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_nutrition_ext_104_peds_nutrition_isolation ON tier5_nutrition_ext_104_peds_nutrition;
CREATE POLICY tier5_nutrition_ext_104_peds_nutrition_isolation ON tier5_nutrition_ext_104_peds_nutrition
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));