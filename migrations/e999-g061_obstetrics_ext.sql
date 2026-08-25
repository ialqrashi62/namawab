-- filepath: migrations/e999-g061_obstetrics_ext.sql
-- TIER41 Obstetrics Extended 2 (5 tables)
CREATE TABLE IF NOT EXISTS ob_high_risk (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  gestational_age_weeks INT,
  severity TEXT,
  bp_systolic NUMERIC,
  bp_diastolic NUMERIC,
  gtt_1hr NUMERIC,
  afi NUMERIC,
  surveillance TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ob_high_risk ENABLE ROW LEVEL SECURITY;
ALTER TABLE ob_high_risk FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ob_high_risk;
CREATE POLICY p1 ON ob_high_risk USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ob_fetal_mon (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  test_type TEXT,
  gestational_age_weeks INT,
  result TEXT,
  baseline_fhr INT,
  bpp_total INT,
  afi NUMERIC,
  interpretation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ob_fetal_mon ENABLE ROW LEVEL SECURITY;
ALTER TABLE ob_fetal_mon FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ob_fetal_mon;
CREATE POLICY p1 ON ob_fetal_mon USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ob_proc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  indication TEXT,
  gestational_age_weeks INT,
  complications TEXT,
  success TEXT,
  karyotype TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ob_proc ENABLE ROW LEVEL SECURITY;
ALTER TABLE ob_proc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ob_proc;
CREATE POLICY p1 ON ob_proc USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ob_postpartum (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  day_postpartum INT,
  condition TEXT,
  severity TEXT,
  ebl NUMERIC,
  screening_score INT,
  treatment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ob_postpartum ENABLE ROW LEVEL SECURITY;
ALTER TABLE ob_postpartum FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ob_postpartum;
CREATE POLICY p1 ON ob_postpartum USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ob_lactation (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  postpartum_day INT,
  issue TEXT,
  severity TEXT,
  affected_breast TEXT,
  recommendation TEXT,
  monitoring_required TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ob_lactation ENABLE ROW LEVEL SECURITY;
ALTER TABLE ob_lactation FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ob_lactation;
CREATE POLICY p1 ON ob_lactation USING (tenant_id = current_setting('app.tenant_id', true));