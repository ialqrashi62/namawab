-- filepath: migrations/e999-g026_gastroenterology_ext.sql
-- TIER34 Gastroenterology Extended (5 tables)
CREATE TABLE IF NOT EXISTS gi_ibd (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  ibd_type TEXT,
  disease_location TEXT,
  disease_behavior TEXT,
  crp_mg_l NUMERIC,
  calprotectin_ug_g NUMERIC,
  mayo_score NUMERIC,
  surgery_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE gi_ibd ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_ibd FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON gi_ibd;
CREATE POLICY p1 ON gi_ibd USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS gi_hepa (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  ast NUMERIC,
  alt NUMERIC,
  pattern TEXT,
  hbsag TEXT,
  hcv_rna TEXT,
  fibroscan_kpa NUMERIC,
  meld NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE gi_hepa ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_hepa FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON gi_hepa;
CREATE POLICY p1 ON gi_hepa USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS gi_end (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  findings TEXT,
  bowel_prep TEXT,
  withdrawal_time_min NUMERIC,
  adenoma_detection_rate NUMERIC,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE gi_end ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_end FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON gi_end;
CREATE POLICY p1 ON gi_end USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS gi_onco (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  tnm_stage TEXT,
  cea NUMERIC,
  msi_status TEXT,
  lymphoma_type TEXT,
  size_cm NUMERIC,
  mitotic_index TEXT,
  stage TEXT,
  grade TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE gi_onco ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_onco FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON gi_onco;
CREATE POLICY p1 ON gi_onco USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS gi_nut (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  albumin NUMERIC,
  sga_grade TEXT,
  route TEXT,
  formula TEXT,
  diet_type TEXT,
  indication TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE gi_nut ENABLE ROW LEVEL SECURITY;
ALTER TABLE gi_nut FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON gi_nut;
CREATE POLICY p1 ON gi_nut USING (tenant_id = current_setting('app.tenant_id', true));