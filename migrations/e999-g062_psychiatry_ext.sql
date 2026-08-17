-- filepath: migrations/e999-g062_psychiatry_ext.sql
-- TIER42 Psychiatry Extended (5 tables)
CREATE TABLE IF NOT EXISTS psych_mood (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  disorder TEXT,
  severity TEXT,
  score INT,
  treatment TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE psych_mood ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_mood FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON psych_mood;
CREATE POLICY p1 ON psych_mood USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS psych_psychotic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  disorder TEXT,
  subtype TEXT,
  duration_months INT,
  adherence TEXT,
  functioning TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE psych_psychotic ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_psychotic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON psych_psychotic;
CREATE POLICY p1 ON psych_psychotic USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS psych_trauma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  disorder TEXT,
  score INT,
  trauma_type TEXT,
  treatment TEXT,
  severity TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE psych_trauma ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_trauma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON psych_trauma;
CREATE POLICY p1 ON psych_trauma USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS psych_substance (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  substance TEXT,
  pattern TEXT,
  score INT,
  intervention TEXT,
  maintenance TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE psych_substance ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_substance FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON psych_substance;
CREATE POLICY p1 ON psych_substance USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS psych_neurodev (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  disorder TEXT,
  subtype TEXT,
  score INT,
  presentation TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE psych_neurodev ENABLE ROW LEVEL SECURITY;
ALTER TABLE psych_neurodev FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON psych_neurodev;
CREATE POLICY p1 ON psych_neurodev USING (tenant_id = current_setting('app.tenant_id', true));