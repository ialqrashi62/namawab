-- filepath: migrations/e999-g073_oncology_ext.sql
-- TIER53 Oncology Extended 2 (5 tables)
CREATE TABLE IF NOT EXISTS onc_breast (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  subtype TEXT,
  stage TEXT,
  histology TEXT,
  her2 TEXT,
  line NUMERIC,
  treatment TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE onc_breast ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_breast FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON onc_breast;
CREATE POLICY p1 ON onc_breast USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS onc_lung (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  subtype TEXT,
  stage TEXT,
  histology TEXT,
  mutations TEXT,
  treatment TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE onc_lung ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_lung FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON onc_lung;
CREATE POLICY p1 ON onc_lung USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS onc_gi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  type TEXT,
  stage TEXT,
  ca_19_9 NUMERIC,
  treatment TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE onc_gi ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_gi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON onc_gi;
CREATE POLICY p1 ON onc_gi USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS onc_gu (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  organ TEXT,
  stage TEXT,
  histology TEXT,
  psa NUMERIC,
  treatment TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE onc_gu ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_gu FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON onc_gu;
CREATE POLICY p1 ON onc_gu USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS onc_heme (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  malignancy TEXT,
  subtype TEXT,
  phase TEXT,
  treatment TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE onc_heme ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_heme FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON onc_heme;
CREATE POLICY p1 ON onc_heme USING (tenant_id = current_setting('app.tenant_id', true));