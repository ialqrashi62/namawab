-- e502 TIER4_NUTR-102 MUST + Calorie
CREATE TABLE IF NOT EXISTS tier4_nutr_102_mst (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  unintentional_weight_loss_pct NUMERIC NOT NULL,
  bmi NUMERIC NOT NULL,
  muscle_loss BOOLEAN,
  fat_loss BOOLEAN,
  malnutrition TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_102_mst ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_102_mst FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_102_mst_t ON tier4_nutr_102_mst;
CREATE POLICY tier4_nutr_102_mst_t ON tier4_nutr_102_mst
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_nutr_102_calorie (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  weight_kg NUMERIC NOT NULL,
  height_cm NUMERIC NOT NULL,
  age NUMERIC NOT NULL,
  is_female BOOLEAN,
  activity_factor NUMERIC NOT NULL,
  bmr NUMERIC,
  tdee NUMERIC,
  goal NUMERIC,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_102_calorie ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_102_calorie FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_102_calorie_t ON tier4_nutr_102_calorie;
CREATE POLICY tier4_nutr_102_calorie_t ON tier4_nutr_102_calorie
  USING (tenant_id = current_setting('app.tenant_id', true));