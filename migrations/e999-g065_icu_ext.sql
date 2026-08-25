-- filepath: migrations/e999-g065_icu_ext.sql
-- TIER45 ICU Extended (5 tables)
CREATE TABLE IF NOT EXISTS icu_vent (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  pao2_fio2 NUMERIC,
  fio2 NUMERIC,
  peep NUMERIC,
  tidal_volume NUMERIC,
  severity TEXT,
  mortality_risk TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE icu_vent ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_vent FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON icu_vent;
CREATE POLICY p1 ON icu_vent USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS icu_sepsis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  lactate NUMERIC,
  wbc NUMERIC,
  organism TEXT,
  source TEXT,
  antibiotics TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE icu_sepsis ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_sepsis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON icu_sepsis;
CREATE POLICY p1 ON icu_sepsis USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS icu_hemodyn (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  shock_type TEXT,
  etiology TEXT,
  ef NUMERIC,
  map NUMERIC,
  lactate NUMERIC,
  support TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE icu_hemodyn ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_hemodyn FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON icu_hemodyn;
CREATE POLICY p1 ON icu_hemodyn USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS icu_neuro (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  gcs INT,
  nihss INT,
  hunt_hess INT,
  icp NUMERIC,
  severity TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE icu_neuro ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_neuro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON icu_neuro;
CREATE POLICY p1 ON icu_neuro USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS icu_renal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  kdigo_stage INT,
  creatinine NUMERIC,
  ph NUMERIC,
  electrolyte TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE icu_renal ENABLE ROW LEVEL SECURITY;
ALTER TABLE icu_renal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON icu_renal;
CREATE POLICY p1 ON icu_renal USING (tenant_id = current_setting('app.tenant_id', true));