-- filepath: migrations/e995_lab_up.sql
-- TIER10_LAB_EXT 101-106 lab tables

CREATE TABLE IF NOT EXISTS tier10_lab_pathology (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  case_id TEXT,
  specimen_id TEXT,
  diagnosis_category TEXT,
  margins TEXT,
  ihc_panel TEXT,
  fs_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier10_lab_pathology ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier10_lab_pathology FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier10_lab_pathology_tenant ON tier10_lab_pathology;
CREATE POLICY tier10_lab_pathology_tenant ON tier10_lab_pathology USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier10_lab_pathology_tenant_idx ON tier10_lab_pathology (tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier10_lab_chemistry (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  panel_type TEXT,
  severity TEXT,
  interpretation TEXT,
  qc_status TEXT,
  cv_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier10_lab_chemistry ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier10_lab_chemistry FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier10_lab_chemistry_tenant ON tier10_lab_chemistry;
CREATE POLICY tier10_lab_chemistry_tenant ON tier10_lab_chemistry USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier10_lab_chemistry_tenant_idx ON tier10_lab_chemistry (tenant_id, panel_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tier10_lab_micro (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  specimen_id TEXT,
  organism_observed TEXT,
  mrs_phenotype TEXT,
  bc_status TEXT,
  afb_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier10_lab_micro ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier10_lab_micro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier10_lab_micro_tenant ON tier10_lab_micro;
CREATE POLICY tier10_lab_micro_tenant ON tier10_lab_micro USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier10_lab_micro_tenant_idx ON tier10_lab_micro (tenant_id, organism_observed, created_at DESC);

CREATE TABLE IF NOT EXISTS tier10_lab_hematology (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  cell_morphology TEXT,
  blast_pct_band TEXT,
  coag_status TEXT,
  clonality TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier10_lab_hematology ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier10_lab_hematology FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier10_lab_hematology_tenant ON tier10_lab_hematology;
CREATE POLICY tier10_lab_hematology_tenant ON tier10_lab_hematology USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier10_lab_hematology_tenant_idx ON tier10_lab_hematology (tenant_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier10_lab_bloodbank (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  unit_id TEXT,
  abogroup TEXT,
  compatibility TEXT,
  reaction_status TEXT,
  inventory_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier10_lab_bloodbank ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier10_lab_bloodbank FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier10_lab_bloodbank_tenant ON tier10_lab_bloodbank;
CREATE POLICY tier10_lab_bloodbank_tenant ON tier10_lab_bloodbank USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier10_lab_bloodbank_tenant_idx ON tier10_lab_bloodbank (tenant_id, abogroup, created_at DESC);

CREATE TABLE IF NOT EXISTS tier10_lab_genetics (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  panel_name TEXT,
  variant_classes TEXT,
  clonality TEXT,
  phenotype TEXT,
  result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier10_lab_genetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier10_lab_genetics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier10_lab_genetics_tenant ON tier10_lab_genetics;
CREATE POLICY tier10_lab_genetics_tenant ON tier10_lab_genetics USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier10_lab_genetics_tenant_idx ON tier10_lab_genetics (tenant_id, panel_name, created_at DESC);