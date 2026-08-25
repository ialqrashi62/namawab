-- e453 TIER4_PATH-101 Hematology
CREATE TABLE IF NOT EXISTS tier4_path_101_heme_cbc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hgb NUMERIC NOT NULL,
  wbc NUMERIC NOT NULL,
  platelet NUMERIC NOT NULL,
  mcv NUMERIC NOT NULL,
  neutrophil NUMERIC NOT NULL,
  interpretation TEXT,
  pancytopenia TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_101_heme_cbc ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_101_heme_cbc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_101_heme_cbc_t ON tier4_path_101_heme_cbc;
CREATE POLICY tier4_path_101_heme_cbc_t ON tier4_path_101_heme_cbc
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_path_101_heme_smear (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  smear_features TEXT,
  schistocytes BOOLEAN,
  blasts BOOLEAN,
  atypical_lymphocytes BOOLEAN,
  target_cells BOOLEAN,
  impression TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_101_heme_smear ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_101_heme_smear FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_101_heme_smear_t ON tier4_path_101_heme_smear;
CREATE POLICY tier4_path_101_heme_smear_t ON tier4_path_101_heme_smear
  USING (tenant_id = current_setting('app.tenant_id', true));