-- filepath: migrations/e999-g006_hematology_ext.sql
-- TIER30 Hematology Extended (5 tables: transfusion, apheresis, stem_cell, cell_therapy, coag_ext)
-- FORCE_RLS=150 tenant isolation

CREATE TABLE IF NOT EXISTS hematology_transfusion (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  transfusion_id TEXT NOT NULL,
  unit_number TEXT,
  blood_group TEXT,
  volume_ml NUMERIC,
  hgb_pre NUMERIC,
  reaction BOOLEAN,
  pre_meds BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE hematology_transfusion ENABLE ROW LEVEL SECURITY;
ALTER TABLE hematology_transfusion FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON hematology_transfusion;
CREATE POLICY p1 ON hematology_transfusion USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS hematology_apheresis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  procedure TEXT,
  volume_exchanged_ml NUMERIC,
  replacement TEXT,
  calcium_replacement BOOLEAN,
  symptoms TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE hematology_apheresis ENABLE ROW LEVEL SECURITY;
ALTER TABLE hematology_apheresis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON hematology_apheresis;
CREATE POLICY p1 ON hematology_apheresis USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS hematology_stem_cell (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  session_id TEXT,
  regimen TEXT,
  cd34_target NUMERIC,
  cd34_collected NUMERIC,
  collection_day NUMERIC,
  chemo_mobilization BOOLEAN,
  viability_pct NUMERIC,
  cryoprotectant TEXT,
  storage_temp NUMERIC,
  transplant_id TEXT,
  neutrophil_engraftment_day NUMERIC,
  chimerism_pct NUMERIC,
  gvhd_grade TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE hematology_stem_cell ENABLE ROW LEVEL SECURITY;
ALTER TABLE hematology_stem_cell FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON hematology_stem_cell;
CREATE POLICY p1 ON hematology_stem_cell USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS hematology_cell_therapy (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  session_id TEXT,
  cell_product TEXT,
  tumor_type TEXT,
  infusion_cells NUMERIC,
  response TEXT,
  complication TEXT,
  monitoring_days NUMERIC,
  follow_up_day NUMERIC,
  cell_viability NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE hematology_cell_therapy ENABLE ROW LEVEL SECURITY;
ALTER TABLE hematology_cell_therapy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON hematology_cell_therapy;
CREATE POLICY p1 ON hematology_cell_therapy USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS hematology_coag_ext (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  episode_id TEXT,
  factor TEXT,
  baseline_pct NUMERIC,
  post_pct NUMERIC,
  dosing_units NUMERIC,
  half_life_h NUMERIC,
  indication TEXT,
  inhibitor_titer NUMERIC,
  product TEXT,
  protein_c_pct NUMERIC,
  protein_s_pct NUMERIC,
  istg_score NUMERIC,
  plt_count NUMERIC,
  pt NUMERIC,
  fibrinogen NUMERIC,
  treatment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE hematology_coag_ext ENABLE ROW LEVEL SECURITY;
ALTER TABLE hematology_coag_ext FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON hematology_coag_ext;
CREATE POLICY p1 ON hematology_coag_ext USING (tenant_id = current_setting('app.tenant_id', true));