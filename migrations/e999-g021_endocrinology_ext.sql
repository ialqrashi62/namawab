-- filepath: migrations/e999-g021_endocrinology_ext.sql
-- TIER33 Endocrinology Endocrine (5 tables)
CREATE TABLE IF NOT EXISTS endo_diabetes (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  hba1c_pct NUMERIC,
  fpg_mg_dl NUMERIC,
  time_in_range_pct NUMERIC,
  retinopathy TEXT,
  nephropathy TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE endo_diabetes ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_diabetes FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON endo_diabetes;
CREATE POLICY p1 ON endo_diabetes USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS endo_thyroid (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  tsh NUMERIC,
  free_t4 NUMERIC,
  tirads TEXT,
  etiology TEXT,
  levothyroxine_dose NUMERIC,
  stage TEXT,
  thyroglobulin NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE endo_thyroid ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_thyroid FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON endo_thyroid;
CREATE POLICY p1 ON endo_thyroid USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS endo_adrenal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  lesion_size_cm NUMERIC,
  hounsfield_units NUMERIC,
  cortisol_am NUMERIC,
  acth NUMERIC,
  arr NUMERIC,
  plasma_metanephrine NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE endo_adrenal ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_adrenal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON endo_adrenal;
CREATE POLICY p1 ON endo_adrenal USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS endo_pituitary (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  tumor_size_mm NUMERIC,
  prolactin NUMERIC,
  igf1 NUMERIC,
  urine_output_ml_day NUMERIC,
  presentation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE endo_pituitary ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_pituitary FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON endo_pituitary;
CREATE POLICY p1 ON endo_pituitary USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS endo_metabolic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  bmi NUMERIC,
  ldl NUMERIC,
  t_score NUMERIC,
  identified_gender TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE endo_metabolic ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_metabolic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON endo_metabolic;
CREATE POLICY p1 ON endo_metabolic USING (tenant_id = current_setting('app.tenant_id', true));