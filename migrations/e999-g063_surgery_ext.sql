-- filepath: migrations/e999-g063_surgery_ext.sql
-- TIER43 Surgery Extended 2 (5 tables)
CREATE TABLE IF NOT EXISTS surg_gi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  approach TEXT,
  indication TEXT,
  op_time_min INT,
  ebl NUMERIC,
  length_of_stay_days INT,
  complications TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE surg_gi ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_gi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON surg_gi;
CREATE POLICY p1 ON surg_gi USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS surg_ortho (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  joint TEXT,
  bone TEXT,
  fixation TEXT,
  approach TEXT,
  op_time_min INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE surg_ortho ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_ortho FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON surg_ortho;
CREATE POLICY p1 ON surg_ortho USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS surg_vasc (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  approach TEXT,
  indication TEXT,
  graft TEXT,
  success TEXT,
  op_time_min INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE surg_vasc ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_vasc FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON surg_vasc;
CREATE POLICY p1 ON surg_vasc USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS surg_trauma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  indication TEXT,
  zone TEXT,
  compartment TEXT,
  fracture TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE surg_trauma ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_trauma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON surg_trauma;
CREATE POLICY p1 ON surg_trauma USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS surg_transplant (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  organ TEXT,
  donor_type TEXT,
  indication TEXT,
  cold_ischemia_hours NUMERIC,
  crossmatch TEXT,
  complications TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE surg_transplant ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_transplant FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON surg_transplant;
CREATE POLICY p1 ON surg_transplant USING (tenant_id = current_setting('app.tenant_id', true));