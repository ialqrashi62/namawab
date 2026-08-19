-- filepath: migrations/e999-g145_lab_ext.sql
CREATE TABLE IF NOT EXISTS tier125_lab_advanced_648 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  cbc_id TEXT, bmp_id TEXT, coag_id TEXT, ua_id TEXT, malb_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier125_lab_advanced_648 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier125_lab_advanced_648 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t125_la_648_isolation ON tier125_lab_advanced_648;
CREATE POLICY t125_la_648_isolation ON tier125_lab_advanced_648 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier125_pathology_649 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  path_id TEXT, cyt_id TEXT, fs_id TEXT, ihc_id TEXT, mol_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier125_pathology_649 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier125_pathology_649 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t125_pa_649_isolation ON tier125_pathology_649;
CREATE POLICY t125_pa_649_isolation ON tier125_pathology_649 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier125_microbiology_650 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  culture_id TEXT, gram_id TEXT, sens_id TEXT, para_id TEXT, myc_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier125_microbiology_650 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier125_microbiology_650 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t125_mc_650_isolation ON tier125_microbiology_650;
CREATE POLICY t125_mc_650_isolation ON tier125_microbiology_650 USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier125_transfusion_651 (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  type_id TEXT, xm_id TEXT, tx_id TEXT, rxn_id TEXT, aph_id TEXT,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier125_transfusion_651 ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier125_transfusion_651 FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS t125_tf_651_isolation ON tier125_transfusion_651;
CREATE POLICY t125_tf_651_isolation ON tier125_transfusion_651 USING (tenant_id = current_setting('app.tenant_id', true));