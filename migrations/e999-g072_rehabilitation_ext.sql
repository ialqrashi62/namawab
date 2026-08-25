-- filepath: migrations/e999-g072_rehabilitation_ext.sql
-- TIER52 Rehabilitation Extended 2 (5 tables)
CREATE TABLE IF NOT EXISTS rehab_pt (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  diagnosis TEXT,
  level TEXT,
  score NUMERIC,
  assist_device TEXT,
  discharge_plan TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rehab_pt ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_pt FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rehab_pt;
CREATE POLICY p1 ON rehab_pt USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rehab_ot (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  area TEXT,
  goal TEXT,
  progress TEXT,
  rom TEXT,
  grip_strength_kg NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rehab_ot ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_ot FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rehab_ot;
CREATE POLICY p1 ON rehab_ot USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rehab_slp (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  severity TEXT,
  wab_aq NUMERIC,
  mbbs TEXT,
  phonation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rehab_slp ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_slp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rehab_slp;
CREATE POLICY p1 ON rehab_slp USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rehab_prosth (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  device TEXT,
  type TEXT,
  side TEXT,
  level TEXT,
  chair_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rehab_prosth ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_prosth FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rehab_prosth;
CREATE POLICY p1 ON rehab_prosth USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rehab_pain (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  program TEXT,
  type TEXT,
  oswestry NUMERIC,
  stage INT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rehab_pain ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_pain FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rehab_pain;
CREATE POLICY p1 ON rehab_pain USING (tenant_id = current_setting('app.tenant_id', true));