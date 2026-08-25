-- e385 TIER4_ENDO-101 Diabetes
CREATE TABLE IF NOT EXISTS tier4_endo_101_diabetes_classify (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hba1c_pct NUMERIC NOT NULL,
  age_at_diagnosis INT NOT NULL,
  bmi NUMERIC NOT NULL,
  antibody_status TEXT,
  c_peptide TEXT,
  type TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_101_diabetes_classify ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_101_diabetes_classify FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_101_diabetes_classify_t ON tier4_endo_101_diabetes_classify;
CREATE POLICY tier4_endo_101_diabetes_classify_t ON tier4_endo_101_diabetes_classify
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_101_diabetes_insulin (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hba1c_pct NUMERIC,
  fpg_mg_dl NUMERIC,
  egfr NUMERIC,
  weight_kg NUMERIC,
  insulin_candidate BOOLEAN,
  therapy TEXT,
  starting_dose_units NUMERIC,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_101_diabetes_insulin ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_101_diabetes_insulin FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_101_diabetes_insulin_t ON tier4_endo_101_diabetes_insulin;
CREATE POLICY tier4_endo_101_diabetes_insulin_t ON tier4_endo_101_diabetes_insulin
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_endo_101_diabetes_dka (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  glucose_mg_dl NUMERIC,
  ph NUMERIC,
  bicarbonate NUMERIC,
  anion_gap NUMERIC,
  ketones TEXT,
  severity TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_endo_101_diabetes_dka ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_endo_101_diabetes_dka FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_endo_101_diabetes_dka_t ON tier4_endo_101_diabetes_dka;
CREATE POLICY tier4_endo_101_diabetes_dka_t ON tier4_endo_101_diabetes_dka
  USING (tenant_id = current_setting('app.tenant_id', true));