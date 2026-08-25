-- e503 TIER4_NUTR-103 Pediatric
CREATE TABLE IF NOT EXISTS tier4_nutr_103_ped_formula (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age_months NUMERIC NOT NULL,
  weight_kg NUMERIC NOT NULL,
  feedings_per_day NUMERIC NOT NULL,
  formula_type TEXT NOT NULL,
  cow_milk_allergy BOOLEAN,
  formula TEXT,
  daily_volume_ml NUMERIC,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_103_ped_formula ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_103_ped_formula FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_103_ped_formula_t ON tier4_nutr_103_ped_formula;
CREATE POLICY tier4_nutr_103_ped_formula_t ON tier4_nutr_103_ped_formula
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_nutr_103_ped_ftt (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  weight_z_score NUMERIC NOT NULL,
  height_z_score NUMERIC NOT NULL,
  caloric_intake_pct NUMERIC NOT NULL,
  chronic_illness BOOLEAN,
  severity TEXT,
  therapy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_nutr_103_ped_ftt ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_nutr_103_ped_ftt FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_nutr_103_ped_ftt_t ON tier4_nutr_103_ped_ftt;
CREATE POLICY tier4_nutr_103_ped_ftt_t ON tier4_nutr_103_ped_ftt
  USING (tenant_id = current_setting('app.tenant_id', true));