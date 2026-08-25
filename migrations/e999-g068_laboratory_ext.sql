-- filepath: migrations/e999-g068_laboratory_ext.sql
-- TIER48 Laboratory Extended 2 (5 tables)
CREATE TABLE IF NOT EXISTS lab_heme (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  test TEXT,
  wbc NUMERIC,
  hgb NUMERIC,
  plt NUMERIC,
  pt NUMERIC,
  ptt NUMERIC,
  innr NUMERIC,
  interpretation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE lab_heme ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_heme FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON lab_heme;
CREATE POLICY p1 ON lab_heme USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS lab_chem (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  test TEXT,
  sodium NUMERIC,
  potassium NUMERIC,
  creatinine NUMERIC,
  glucose NUMERIC,
  ast NUMERIC,
  alt NUMERIC,
  tsh NUMERIC,
  interpretation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE lab_chem ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_chem FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON lab_chem;
CREATE POLICY p1 ON lab_chem USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS lab_micro (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  source TEXT,
  organism TEXT,
  susceptibility TEXT,
  contaminant TEXT,
  interpretation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE lab_micro ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_micro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON lab_micro;
CREATE POLICY p1 ON lab_micro USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS lab_immuno (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  test TEXT,
  ana TEXT,
  igg NUMERIC,
  iga NUMERIC,
  il6 NUMERIC,
  crp NUMERIC,
  interpretation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE lab_immuno ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_immuno FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON lab_immuno;
CREATE POLICY p1 ON lab_immuno USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS lab_mol (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  test TEXT,
  target TEXT,
  result TEXT,
  mutations TEXT,
  interpretation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE lab_mol ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_mol FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON lab_mol;
CREATE POLICY p1 ON lab_mol USING (tenant_id = current_setting('app.tenant_id', true));