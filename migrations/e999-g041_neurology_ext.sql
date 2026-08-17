-- filepath: migrations/e999-g041_neurology_ext.sql
-- TIER37 Neurology Extended (5 tables)
CREATE TABLE IF NOT EXISTS neuro_stroke (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  nihss NUMERIC,
  onset_min NUMERIC,
  occlusion_vessel TEXT,
  classification TEXT,
  bp_systolic NUMERIC,
  onset_to_puncture_min NUMERIC,
  etiology TEXT,
  fim_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE neuro_stroke ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_stroke FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON neuro_stroke;
CREATE POLICY p1 ON neuro_stroke USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS neuro_epi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  seizure_type TEXT,
  eeg_finding TEXT,
  mri_finding TEXT,
  first_drug TEXT,
  duration_min NUMERIC,
  engel_outcome TEXT,
  interpretation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE neuro_epi ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_epi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON neuro_epi;
CREATE POLICY p1 ON neuro_epi USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS neuro_ms (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  mri_lesion_count NUMERIC,
  oligoclonal_bands TEXT,
  diagnosis TEXT,
  dmts TEXT,
  relapse_severity TEXT,
  edss_current NUMERIC,
  symptom TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE neuro_ms ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_ms FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON neuro_ms;
CREATE POLICY p1 ON neuro_ms USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS neuro_mov (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  tremor TEXT,
  bradykinesia BOOLEAN,
  diagnosis TEXT,
  target TEXT,
  tremor_type TEXT,
  botox_treatment BOOLEAN,
  mri_finding TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE neuro_mov ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_mov FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON neuro_mov;
CREATE POLICY p1 ON neuro_mov USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS neuro_nm (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  als_frs_baseline NUMERIC,
  diagnosis TEXT,
  achr_ab TEXT,
  type TEXT,
  emg_ncs TEXT,
  symptoms TEXT,
  bp_drop NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE neuro_nm ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_nm FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON neuro_nm;
CREATE POLICY p1 ON neuro_nm USING (tenant_id = current_setting('app.tenant_id', true));