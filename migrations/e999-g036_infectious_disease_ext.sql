-- filepath: migrations/e999-g036_infectious_disease_ext.sql
-- TIER36 Infectious Disease Extended (5 tables)
CREATE TABLE IF NOT EXISTS infx_hiv (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  cd4 NUMERIC,
  viral_load NUMERIC,
  regimen TEXT,
  oi_type TEXT,
  prep_regimen TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE infx_hiv ENABLE ROW LEVEL SECURITY;
ALTER TABLE infx_hiv FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON infx_hiv;
CREATE POLICY p1 ON infx_hiv USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS infx_tb (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  sputum_afb TEXT,
  genexpert TEXT,
  regimen TEXT,
  test TEXT,
  prophylaxis TEXT,
  resistance_pattern TEXT,
  contact_count NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE infx_tb ENABLE ROW LEVEL SECURITY;
ALTER TABLE infx_tb FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON infx_tb;
CREATE POLICY p1 ON infx_tb USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS infx_hepa (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  igm_anti_hav TEXT,
  igm_anti_hev TEXT,
  anti_hdv_igm TEXT,
  hbv_dna NUMERIC,
  hcv_viral_load NUMERIC,
  hcv_genotype NUMERIC,
  treatment_initiated TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE infx_hepa ENABLE ROW LEVEL SECURITY;
ALTER TABLE infx_hepa FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON infx_hepa;
CREATE POLICY p1 ON infx_hepa USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS infx_trop (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  species TEXT,
  parasitemia_pct NUMERIC,
  severity TEXT,
  igm_positive BOOLEAN,
  platelet NUMERIC,
  culture TEXT,
  parasite TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE infx_trop ENABLE ROW LEVEL SECURITY;
ALTER TABLE infx_trop FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON infx_trop;
CREATE POLICY p1 ON infx_trop USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS infx_stew (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  culture_result TEXT,
  antibiotic TEXT,
  antibiotic_days NUMERIC,
  de_escalate TEXT,
  intervention TEXT,
  outcome TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE infx_stew ENABLE ROW LEVEL SECURITY;
ALTER TABLE infx_stew FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON infx_stew;
CREATE POLICY p1 ON infx_stew USING (tenant_id = current_setting('app.tenant_id', true));