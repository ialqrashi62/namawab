-- filepath: migrations/e999-g051_ent_ext.sql
-- TIER39 ENT Extended (5 tables)
CREATE TABLE IF NOT EXISTS ent_oto (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  type TEXT,
  side TEXT,
  audiogram_pta NUMERIC,
  severity TEXT,
  grade TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ent_oto ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_oto FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ent_oto;
CREATE POLICY p1 ON ent_oto USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ent_rhino (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  type TEXT,
  duration_weeks NUMERIC,
  antibiotic TEXT,
  grade TEXT,
  severity TEXT,
  treatment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ent_rhino ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_rhino FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ent_rhino;
CREATE POLICY p1 ON ent_rhino USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ent_laryn (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  duration_weeks NUMERIC,
  lesion TEXT,
  severity TEXT,
  stage TEXT,
  decannulation_planning BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ent_laryn ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_laryn FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ent_laryn;
CREATE POLICY p1 ON ent_laryn USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ent_hn (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  nodule_size_cm NUMERIC,
  tirads TEXT,
  cytology TEXT,
  location TEXT,
  size_cm NUMERIC,
  fnac TEXT,
  size_cm_node NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ent_hn ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_hn FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ent_hn;
CREATE POLICY p1 ON ent_hn USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS ent_ped (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  age NUMERIC,
  indication TEXT,
  infections_per_year NUMERIC,
  tympanostomy_tubes_planned BOOLEAN,
  severity TEXT,
  result TEXT,
  adenoid_size TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE ent_ped ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_ped FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON ent_ped;
CREATE POLICY p1 ON ent_ped USING (tenant_id = current_setting('app.tenant_id', true));