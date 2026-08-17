-- filepath: migrations/e999-g077_imaging_ext.sql
-- TIER57 Imaging Extended (5 tables)
CREATE TABLE IF NOT EXISTS img_advanced (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  modality TEXT,
  tracer TEXT,
  indication TEXT,
  findings TEXT,
  interpretation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE img_advanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE img_advanced FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON img_advanced;
CREATE POLICY p1 ON img_advanced USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS img_us_ext (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  study TEXT,
  joint TEXT,
  site TEXT,
  findings TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE img_us_ext ENABLE ROW LEVEL SECURITY;
ALTER TABLE img_us_ext FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON img_us_ext;
CREATE POLICY p1 ON img_us_ext USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS img_breast (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  modality TEXT,
  indication TEXT,
  birads INT,
  lesion_size_mm NUMERIC,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE img_breast ENABLE ROW LEVEL SECURITY;
ALTER TABLE img_breast FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON img_breast;
CREATE POLICY p1 ON img_breast USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS img_msk (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  study TEXT,
  joint TEXT,
  region TEXT,
  modality TEXT,
  findings TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE img_msk ENABLE ROW LEVEL SECURITY;
ALTER TABLE img_msk FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON img_msk;
CREATE POLICY p1 ON img_msk USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS img_emergent (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  modality TEXT,
  indication TEXT,
  findings TEXT,
  recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE img_emergent ENABLE ROW LEVEL SECURITY;
ALTER TABLE img_emergent FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON img_emergent;
CREATE POLICY p1 ON img_emergent USING (tenant_id = current_setting('app.tenant_id', true));