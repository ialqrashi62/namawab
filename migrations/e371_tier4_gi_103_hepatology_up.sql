-- e371 TIER4_GI-103 Hepatology (cirrhosis, hepatitis, ascites, HE)
CREATE TABLE IF NOT EXISTS tier4_gi_103_hepatology_cirrhosis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  meld NUMERIC NOT NULL,
  child_pugh TEXT NOT NULL,
  ascites TEXT,
  hepatic_encephalopathy TEXT,
  varices BOOLEAN,
  treatment TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_103_hepatology_cirrhosis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_103_hepatology_cirrhosis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_103_hepatology_cirrhosis_t ON tier4_gi_103_hepatology_cirrhosis;
CREATE POLICY tier4_gi_103_hepatology_cirrhosis_t ON tier4_gi_103_hepatology_cirrhosis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_103_hepatology_hepatitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  type TEXT NOT NULL,
  viral_load NUMERIC,
  alt NUMERIC,
  fibrosis TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_103_hepatology_hepatitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_103_hepatology_hepatitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_103_hepatology_hepatitis_t ON tier4_gi_103_hepatology_hepatitis;
CREATE POLICY tier4_gi_103_hepatology_hepatitis_t ON tier4_gi_103_hepatology_hepatitis
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_103_hepatology_ascites (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  ascites_grade TEXT,
  sodium NUMERIC,
  creatinine NUMERIC,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_103_hepatology_ascites ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_103_hepatology_ascites FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_103_hepatology_ascites_t ON tier4_gi_103_hepatology_ascites;
CREATE POLICY tier4_gi_103_hepatology_ascites_t ON tier4_gi_103_hepatology_ascites
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_103_hepatology_he (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  westhaven_grade INT NOT NULL,
  ammonia NUMERIC,
  trigger TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_103_hepatology_he ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_103_hepatology_he FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_103_hepatology_he_t ON tier4_gi_103_hepatology_he;
CREATE POLICY tier4_gi_103_hepatology_he_t ON tier4_gi_103_hepatology_he
  USING (tenant_id = current_setting('app.tenant_id', true));