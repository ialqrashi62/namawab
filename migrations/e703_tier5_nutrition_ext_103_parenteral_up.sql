-- TIER5_NUTRITION_EXT-103 Parenteral
CREATE TABLE IF NOT EXISTS tier5_nutrition_ext_103_parenteral (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL DEFAULT 'tenant_test_001',
  patient_id TEXT NOT NULL,
  total_kcal INT,
  osmolarity INT,
  route TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier5_nutrition_ext_103_parenteral ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier5_nutrition_ext_103_parenteral FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier5_nutrition_ext_103_parenteral_isolation ON tier5_nutrition_ext_103_parenteral;
CREATE POLICY tier5_nutrition_ext_103_parenteral_isolation ON tier5_nutrition_ext_103_parenteral
  USING (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));