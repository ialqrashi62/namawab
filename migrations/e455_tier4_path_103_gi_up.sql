-- e455 TIER4_PATH-103 GI
CREATE TABLE IF NOT EXISTS tier4_path_103_gi_dysplasia (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  lesion TEXT NOT NULL,
  dysplasia TEXT NOT NULL,
  recommendation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_103_gi_dysplasia ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_103_gi_dysplasia FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_103_gi_dysplasia_t ON tier4_path_103_gi_dysplasia;
CREATE POLICY tier4_path_103_gi_dysplasia_t ON tier4_path_103_gi_dysplasia
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_path_103_gi_hpylori (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  h_pylori TEXT NOT NULL,
  inflammation TEXT NOT NULL,
  atrophy TEXT NOT NULL,
  intestinal_metaplasia BOOLEAN,
  treatment TEXT,
  olga_olgapr TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_path_103_gi_hpylori ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_path_103_gi_hpylori FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_path_103_gi_hpylori_t ON tier4_path_103_gi_hpylori;
CREATE POLICY tier4_path_103_gi_hpylori_t ON tier4_path_103_gi_hpylori
  USING (tenant_id = current_setting('app.tenant_id', true));