-- filepath: migrations/e999-g056_ophthalmology_ext.sql
-- TIER40 Ophthalmology Extended (5 tables)
CREATE TABLE IF NOT EXISTS ophth_glaucoma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  iop_right NUMERIC,
  iop_left NUMERIC,
  cup_disc_ratio_right NUMERIC,
  angle TEXT,
  diagnosis TEXT,
  current_drug TEXT,
  md_slope NUMERIC,
  last_iop NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ophth_glaucoma ENABLE ROW LEVEL SECURITY;
ALTER TABLE ophth_glaucoma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ophth_glaucoma;
CREATE POLICY p1 ON ophth_glaucoma USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ophth_retina (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  type TEXT,
  stage TEXT,
  visual_acuity TEXT,
  oct_cmt NUMERIC,
  anti_vegf TEXT,
  drug TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ophth_retina ENABLE ROW LEVEL SECURITY;
ALTER TABLE ophth_retina FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ophth_retina;
CREATE POLICY p1 ON ophth_retina USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ophth_cornea (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  type TEXT,
  organism TEXT,
  depth TEXT,
  severity TEXT,
  schirmer NUMERIC,
  steepest_k NUMERIC,
  indication TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ophth_cornea ENABLE ROW LEVEL SECURITY;
ALTER TABLE ophth_cornea FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ophth_cornea;
CREATE POLICY p1 ON ophth_cornea USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ophth_plas (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  side TEXT,
  severity TEXT,
  etiology TEXT,
  type TEXT,
  location TEXT,
  biopsy TEXT,
  cas_score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ophth_plas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ophth_plas FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ophth_plas;
CREATE POLICY p1 ON ophth_plas USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ophth_no (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  eye TEXT,
  visual_acuity TEXT,
  mri_lesion TEXT,
  type TEXT,
  mri_pituitary TEXT,
  cranial_nerve TEXT,
  esr NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ophth_no ENABLE ROW LEVEL SECURITY;
ALTER TABLE ophth_no FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ophth_no;
CREATE POLICY p1 ON ophth_no USING (tenant_id = current_setting('app.tenant_id', true));