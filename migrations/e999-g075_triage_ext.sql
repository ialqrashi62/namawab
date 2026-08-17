-- filepath: migrations/e999-g075_triage_ext.sql
-- TIER55 Triage Extended (5 tables)
CREATE TABLE IF NOT EXISTS triage_acu (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  esi_level INT,
  presentation TEXT,
  intervention TEXT,
  triage_decision TEXT,
  time_to_provider_min NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE triage_acu ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_acu FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON triage_acu;
CREATE POLICY p1 ON triage_acu USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS triage_intake (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  chief_complaint TEXT,
  severity TEXT,
  pain_score NUMERIC,
  med_count NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE triage_intake ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_intake FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON triage_intake;
CREATE POLICY p1 ON triage_intake USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS triage_screen (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  screen_type TEXT,
  score NUMERIC,
  positive TEXT,
  referral TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE triage_screen ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_screen FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON triage_screen;
CREATE POLICY p1 ON triage_screen USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS triage_ped (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  age_months NUMERIC,
  assessment TEXT,
  severity TEXT,
  impression TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE triage_ped ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_ped FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON triage_ped;
CREATE POLICY p1 ON triage_ped USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS triage_disp (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  disposition TEXT,
  diagnosis TEXT,
  specialty TEXT,
  reviewed TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE triage_disp ENABLE ROW LEVEL SECURITY;
ALTER TABLE triage_disp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON triage_disp;
CREATE POLICY p1 ON triage_disp USING (tenant_id = current_setting('app.tenant_id', true));