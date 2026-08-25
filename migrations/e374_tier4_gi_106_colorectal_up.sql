-- e374 TIER4_GI-106 Colorectal (hemorrhoids, CRC screening, diverticulitis)
CREATE TABLE IF NOT EXISTS tier4_gi_106_colorectal_hemorrhoids (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  grade TEXT NOT NULL,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_106_colorectal_hemorrhoids ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_106_colorectal_hemorrhoids FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_106_colorectal_hemorrhoids_t ON tier4_gi_106_colorectal_hemorrhoids;
CREATE POLICY tier4_gi_106_colorectal_hemorrhoids_t ON tier4_gi_106_colorectal_hemorrhoids
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_106_colorectal_screening (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  age INT NOT NULL,
  family_history BOOLEAN,
  ibd BOOLEAN,
  fit_or_cologuard TEXT,
  colonoscopy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_106_colorectal_screening ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_106_colorectal_screening FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_106_colorectal_screening_t ON tier4_gi_106_colorectal_screening;
CREATE POLICY tier4_gi_106_colorectal_screening_t ON tier4_gi_106_colorectal_screening
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_gi_106_colorectal_diverticulitis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  hinchey_class TEXT,
  therapy TEXT,
  monitoring TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_gi_106_colorectal_diverticulitis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_gi_106_colorectal_diverticulitis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_gi_106_colorectal_diverticulitis_t ON tier4_gi_106_colorectal_diverticulitis;
CREATE POLICY tier4_gi_106_colorectal_diverticulitis_t ON tier4_gi_106_colorectal_diverticulitis
  USING (tenant_id = current_setting('app.tenant_id', true));