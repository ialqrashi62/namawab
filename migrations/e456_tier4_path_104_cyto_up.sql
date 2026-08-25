-- e456 TIER4_PATH-104 Cytology
CREATE TABLE IF NOT EXISTS tier4_path_104_cyto_thyroid (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  category TEXT NOT NULL,
  recommendation TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_104_cyto_thyroid ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_104_cyto_thyroid FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_104_cyto_thyroid_t ON tier4_path_104_cyto_thyroid;
CREATE POLICY tier4_path_104_cyto_thyroid_t ON tier4_path_104_cyto_thyroid
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_path_104_cyto_breast (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  category TEXT NOT NULL,
  recommendation TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_104_cyto_breast ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_104_cyto_breast FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_104_cyto_breast_t ON tier4_path_104_cyto_breast;
CREATE POLICY tier4_path_104_cyto_breast_t ON tier4_path_104_cyto_breast
  USING (tenant_id = current_setting('app.tenant_id', true));