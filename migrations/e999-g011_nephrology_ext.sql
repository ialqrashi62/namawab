-- filepath: migrations/e999-g011_nephrology_ext.sql
-- TIER31 Nephrology Extended (5 tables: ckd, da, immuno, ext, nutrition)
CREATE TABLE IF NOT EXISTS nephrology_ckd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  egfr NUMERIC,
  acr NUMERIC,
  ckd_cause TEXT,
  ckd_g_stage TEXT,
  ckd_a_stage TEXT,
  hgb NUMERIC,
  tsat NUMERIC,
  calcium NUMERIC,
  phosphorus NUMERIC,
  pth NUMERIC,
  slope NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE nephrology_ckd ENABLE ROW LEVEL SECURITY;
ALTER TABLE nephrology_ckd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON nephrology_ckd;
CREATE POLICY p1 ON nephrology_ckd USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS nephrology_access (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  access_id TEXT,
  type TEXT,
  flow_ml_min NUMERIC,
  complication TEXT,
  intervention TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE nephrology_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE nephrology_access FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON nephrology_access;
CREATE POLICY p1 ON nephrology_access USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS nephrology_immuno (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  donor_id TEXT,
  dsa_present BOOLEAN,
  mfi NUMERIC,
  tacrolimus_trough NUMERIC,
  creatinine_baseline NUMERIC,
  creatinine_current NUMERIC,
  biopsy_result TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE nephrology_immuno ENABLE ROW LEVEL SECURITY;
ALTER TABLE nephrology_immuno FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON nephrology_immuno;
CREATE POLICY p1 ON nephrology_immuno USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS nephrology_ext (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  gn_type TEXT,
  proteinuria_g NUMERIC,
  kidney_size_cm NUMERIC,
  sodium NUMERIC,
  potassium NUMERIC,
  bicarbonate NUMERIC,
  stone_type TEXT,
  bp_systolic NUMERIC,
  bp_diastolic NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE nephrology_ext ENABLE ROW LEVEL SECURITY;
ALTER TABLE nephrology_ext FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON nephrology_ext;
CREATE POLICY p1 ON nephrology_ext USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS nephrology_nutrition (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  egfr NUMERIC,
  potassium NUMERIC,
  phosphorus NUMERIC,
  kt_v NUMERIC,
  albumin NUMERIC,
  dry_weight NUMERIC,
  interdialytic_weight_gain NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE nephrology_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE nephrology_nutrition FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON nephrology_nutrition;
CREATE POLICY p1 ON nephrology_nutrition USING (tenant_id = current_setting('app.tenant_id', true));