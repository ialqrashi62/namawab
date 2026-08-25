-- e501 TIER4_NUTR-101 Nutrition Assessment
CREATE TABLE IF NOT EXISTS tier4_nutr_101_diet_quality (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  fruits_servings_per_day NUMERIC NOT NULL,
  vegetables_servings_per_day NUMERIC NOT NULL,
  whole_grains TEXT NOT NULL,
  processed_meat BOOLEAN,
  sugary_drinks NUMERIC NOT NULL,
  fish_per_week NUMERIC NOT NULL,
  score NUMERIC,
  quality TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_101_diet_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_101_diet_quality FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_101_diet_quality_t ON tier4_nutr_101_diet_quality;
CREATE POLICY tier4_nutr_101_diet_quality_t ON tier4_nutr_101_diet_quality
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_nutr_101_mediter (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  olive_oil BOOLEAN,
  vegetables_servings NUMERIC NOT NULL,
  fruits_servings NUMERIC NOT NULL,
  red_meat_per_week NUMERIC NOT NULL,
  fish_per_week NUMERIC NOT NULL,
  nuts_per_week NUMERIC NOT NULL,
  wine_per_day NUMERIC NOT NULL,
  legumes_per_week NUMERIC NOT NULL,
  score NUMERIC,
  adherence TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_101_mediter ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_101_mediter FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_101_mediter_t ON tier4_nutr_101_mediter;
CREATE POLICY tier4_nutr_101_mediter_t ON tier4_nutr_101_mediter
  USING (tenant_id = current_setting('app.tenant_id', true));