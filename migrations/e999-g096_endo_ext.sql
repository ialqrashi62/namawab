-- migrations/e999-g096_endo_ext.sql
-- TIER76 Endocrinology Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS endo_diabetes_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE endo_diabetes_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_diabetes_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS endo_diabetes_records_t ON endo_diabetes_records;
CREATE POLICY endo_diabetes_records_t ON endo_diabetes_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS endo_thyroid_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE endo_thyroid_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_thyroid_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS endo_thyroid_records_t ON endo_thyroid_records;
CREATE POLICY endo_thyroid_records_t ON endo_thyroid_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS endo_adrenal_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE endo_adrenal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_adrenal_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS endo_adrenal_records_t ON endo_adrenal_records;
CREATE POLICY endo_adrenal_records_t ON endo_adrenal_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS endo_pituitary_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE endo_pituitary_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_pituitary_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS endo_pituitary_records_t ON endo_pituitary_records;
CREATE POLICY endo_pituitary_records_t ON endo_pituitary_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS endo_special_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE endo_special_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE endo_special_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS endo_special_records_t ON endo_special_records;
CREATE POLICY endo_special_records_t ON endo_special_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
