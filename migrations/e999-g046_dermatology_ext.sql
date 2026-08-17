-- filepath: migrations/e999-g046_dermatology_ext.sql
-- TIER38 Dermatology Extended (5 tables)
CREATE TABLE IF NOT EXISTS derm_psor (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  pasi_score NUMERIC,
  bsa_pct NUMERIC,
  dlqi NUMERIC,
  previous_systemic TEXT,
  biologic TEXT,
  pase_positive BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE derm_psor ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_psor FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON derm_psor;
CREATE POLICY p1 ON derm_psor USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS derm_ecz (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  scorad NUMERIC,
  iga NUMERIC,
  eosinophil NUMERIC,
  topical TEXT,
  systemic TEXT,
  excoriation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE derm_ecz ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_ecz FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON derm_ecz;
CREATE POLICY p1 ON derm_ecz USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS derm_skin (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  breslow_mm NUMERIC,
  ulceration BOOLEAN,
  sentinel_node TEXT,
  type TEXT,
  differentiation TEXT,
  lesion_count NUMERIC,
  stages_required NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE derm_skin ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_skin FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON derm_skin;
CREATE POLICY p1 ON derm_skin USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS derm_acne (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  acne_type TEXT,
  lesion_count NUMERIC,
  cysts NUMERIC,
  scar_present BOOLEAN,
  severity TEXT,
  topical TEXT,
  systemic TEXT,
  dose_mg_per_kg NUMERIC,
  cumulative_dose_mg NUMERIC,
  scar_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE derm_acne ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_acne FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON derm_acne;
CREATE POLICY p1 ON derm_acne USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS derm_hair (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  alopecia_type TEXT,
  pattern TEXT,
  tsh NUMERIC,
  ferritin NUMERIC,
  nail TEXT,
  mycology TEXT,
  acuity TEXT,
  condition TEXT,
  bsa_pct NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE derm_hair ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_hair FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON derm_hair;
CREATE POLICY p1 ON derm_hair USING (tenant_id = current_setting('app.tenant_id', true));