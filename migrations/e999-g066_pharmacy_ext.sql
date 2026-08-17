-- filepath: migrations/e999-g066_pharmacy_ext.sql
-- TIER46 Pharmacy Extended 2 (5 tables)
CREATE TABLE IF NOT EXISTS pharm_onco (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  regimen TEXT,
  cycle INT,
  toxicity_grade INT,
  response TEXT,
  next_cycle TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pharm_onco ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharm_onco FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON pharm_onco;
CREATE POLICY p1 ON pharm_onco USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pharm_antinf (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  drug TEXT,
  indication TEXT,
  duration_days INT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pharm_antinf ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharm_antinf FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON pharm_antinf;
CREATE POLICY p1 ON pharm_antinf USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pharm_chronic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  drug_class TEXT,
  indication TEXT,
  hba1c NUMERIC,
  bp NUMERIC,
  ldl NUMERIC,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pharm_chronic ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharm_chronic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON pharm_chronic;
CREATE POLICY p1 ON pharm_chronic USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pharm_pain (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  drug TEXT,
  pain_score INT,
  morphine_equivalent_dose NUMERIC,
  route TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pharm_pain ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharm_pain FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON pharm_pain;
CREATE POLICY p1 ON pharm_pain USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS pharm_special (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  category TEXT,
  drug TEXT,
  schedule INT,
  indication TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE pharm_special ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharm_special FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON pharm_special;
CREATE POLICY p1 ON pharm_special USING (tenant_id = current_setting('app.tenant_id', true));