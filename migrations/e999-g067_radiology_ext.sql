-- filepath: migrations/e999-g067_radiology_ext.sql
-- TIER47 Radiology Extended 2 (5 tables)
CREATE TABLE IF NOT EXISTS rad_body (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  modality TEXT,
  indication TEXT,
  findings TEXT,
  pirads INT,
  birads INT,
  li_rads TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rad_body ENABLE ROW LEVEL SECURITY;
ALTER TABLE rad_body FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rad_body;
CREATE POLICY p1 ON rad_body USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rad_neuro (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  modality TEXT,
  indication TEXT,
  findings TEXT,
  level TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rad_neuro ENABLE ROW LEVEL SECURITY;
ALTER TABLE rad_neuro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rad_neuro;
CREATE POLICY p1 ON rad_neuro USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rad_cardio (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  modality TEXT,
  indication TEXT,
  findings TEXT,
  cad_rads INT,
  ef_percent NUMERIC,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rad_cardio ENABLE ROW LEVEL SECURITY;
ALTER TABLE rad_cardio FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rad_cardio;
CREATE POLICY p1 ON rad_cardio USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rad_gu_gi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  modality TEXT,
  indication TEXT,
  findings TEXT,
  pirads INT,
  psa NUMERIC,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rad_gu_gi ENABLE ROW LEVEL SECURITY;
ALTER TABLE rad_gu_gi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rad_gu_gi;
CREATE POLICY p1 ON rad_gu_gi USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS rad_interv (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  target TEXT,
  approach TEXT,
  success TEXT,
  complications TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE rad_interv ENABLE ROW LEVEL SECURITY;
ALTER TABLE rad_interv FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON rad_interv;
CREATE POLICY p1 ON rad_interv USING (tenant_id = current_setting('app.tenant_id', true));