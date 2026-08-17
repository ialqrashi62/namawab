-- filepath: migrations/e999-g071_dermatology_ext.sql
-- TIER51 Dermatology Extended 2 (5 tables)
CREATE TABLE IF NOT EXISTS derm_infla (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  severity TEXT,
  score NUMERIC,
  therapy TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE derm_infla ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_infla FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON derm_infla;
CREATE POLICY p1 ON derm_infla USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS derm_inf (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  organism TEXT,
  site TEXT,
  severity TEXT,
  antibiotic TEXT,
  duration_days INT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE derm_inf ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_inf FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON derm_inf;
CREATE POLICY p1 ON derm_inf USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS derm_neo (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  lesion TEXT,
  type TEXT,
  breslow_mm NUMERIC,
  size_mm NUMERIC,
  treatment TEXT,
  follow_up TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE derm_neo ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_neo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON derm_neo;
CREATE POLICY p1 ON derm_neo USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS derm_pig (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  type TEXT,
  distribution TEXT,
  therapy TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE derm_pig ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_pig FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON derm_pig;
CREATE POLICY p1 ON derm_pig USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS derm_proced (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  indication TEXT,
  site TEXT,
  size_mm NUMERIC,
  margins_mm NUMERIC,
  complications TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE derm_proced ENABLE ROW LEVEL SECURITY;
ALTER TABLE derm_proced FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON derm_proced;
CREATE POLICY p1 ON derm_proced USING (tenant_id = current_setting('app.tenant_id', true));