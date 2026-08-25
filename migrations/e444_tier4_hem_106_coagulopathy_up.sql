-- e444 TIER4_HEM-106 Coagulopathy
CREATE TABLE IF NOT EXISTS tier4_hem_106_coagulopathy_dic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  platelet_count NUMERIC NOT NULL,
  d_dimer NUMERIC NOT NULL,
  fibrinogen_g_l NUMERIC NOT NULL,
  pt_prolongation_sec NUMERIC NOT NULL,
  score INT,
  stage TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_hem_106_coagulopathy_dic ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_hem_106_coagulopathy_dic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_hem_106_coagulopathy_dic_t ON tier4_hem_106_coagulopathy_dic;
CREATE POLICY tier4_hem_106_coagulopathy_dic_t ON tier4_hem_106_coagulopathy_dic
  USING (tenant_id = current_setting('app.tenant_id', true));