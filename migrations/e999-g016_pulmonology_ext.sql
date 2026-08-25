-- filepath: migrations/e999-g016_pulmonology_ext.sql
-- TIER32 Pulmonology Extended (5 tables)
CREATE TABLE IF NOT EXISTS pulm_copd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  fev1_pct NUMERIC,
  smoking_pack_years NUMERIC,
  exacerbations_per_year NUMERIC,
  spo2 NUMERIC,
  walk_distance_m NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pulm_copd ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_copd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON pulm_copd;
CREATE POLICY p1 ON pulm_copd USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pulm_asthma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  act_score NUMERIC,
  fev1_pct NUMERIC,
  reliever_use_per_week NUMERIC,
  biologic TEXT,
  gina_step NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pulm_asthma ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_asthma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON pulm_asthma;
CREATE POLICY p1 ON pulm_asthma USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pulm_sleep (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  ahi NUMERIC,
  spo2_nadir NUMERIC,
  optimal_pressure_cm_h2o NUMERIC,
  sleep_hours NUMERIC,
  medication TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pulm_sleep ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_sleep FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON pulm_sleep;
CREATE POLICY p1 ON pulm_sleep USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pulm_ild (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  ild_pattern TEXT,
  ct_findings TEXT,
  fvc_pct NUMERIC,
  dlco_pct NUMERIC,
  drug TEXT,
  evaluation_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pulm_ild ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_ild FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON pulm_ild;
CREATE POLICY p1 ON pulm_ild USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pulm_pc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  mode TEXT,
  peep NUMERIC,
  fio2 NUMERIC,
  tidal_volume NUMERIC,
  plateau_pressure NUMERIC,
  oxygenation_index NUMERIC,
  trach_day NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pulm_pc ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_pc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON pulm_pc;
CREATE POLICY p1 ON pulm_pc USING (tenant_id = current_setting('app.tenant_id', true));