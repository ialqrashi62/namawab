-- filepath: migrations/e999-g064_pediatrics_ext.sql
-- TIER44 Pediatrics Extended 2 (5 tables)
CREATE TABLE IF NOT EXISTS ped_resp (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  age_years NUMERIC,
  age_months NUMERIC,
  severity TEXT,
  oxygen_sat NUMERIC,
  treatment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ped_resp ENABLE ROW LEVEL SECURITY;
ALTER TABLE ped_resp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ped_resp;
CREATE POLICY p1 ON ped_resp USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ped_neonat (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  gestational_age_weeks NUMERIC,
  birth_weight_g NUMERIC,
  apgar INT,
  silverman_score INT,
  bilirubin_total NUMERIC,
  treatment TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ped_neonat ENABLE ROW LEVEL SECURITY;
ALTER TABLE ped_neonat FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ped_neonat;
CREATE POLICY p1 ON ped_neonat USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ped_gastro (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  age_years NUMERIC,
  age_months NUMERIC,
  zscore NUMERIC,
  pcDAI INT,
  treatment TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ped_gastro ENABLE ROW LEVEL SECURITY;
ALTER TABLE ped_gastro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ped_gastro;
CREATE POLICY p1 ON ped_gastro USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ped_endo (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  age_years NUMERIC,
  hba1c NUMERIC,
  tsh NUMERIC,
  height_zscore NUMERIC,
  treatment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ped_endo ENABLE ROW LEVEL SECURITY;
ALTER TABLE ped_endo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ped_endo;
CREATE POLICY p1 ON ped_endo USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ped_immuno (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  age_years NUMERIC,
  severity TEXT,
  treatment TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ped_immuno ENABLE ROW LEVEL SECURITY;
ALTER TABLE ped_immuno FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ped_immuno;
CREATE POLICY p1 ON ped_immuno USING (tenant_id = current_setting('app.tenant_id', true));