-- migrations/e999-g091_nut.sql
-- TIER71 Nutrition Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS nut_assess_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE nut_assess_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE nut_assess_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nut_assess_records_t ON nut_assess_records;
CREATE POLICY nut_assess_records_t ON nut_assess_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS nut_intervention_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE nut_intervention_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE nut_intervention_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nut_intervention_records_t ON nut_intervention_records;
CREATE POLICY nut_intervention_records_t ON nut_intervention_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS nut_clinical_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE nut_clinical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE nut_clinical_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nut_clinical_records_t ON nut_clinical_records;
CREATE POLICY nut_clinical_records_t ON nut_clinical_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS nut_pediatric_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE nut_pediatric_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE nut_pediatric_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nut_pediatric_records_t ON nut_pediatric_records;
CREATE POLICY nut_pediatric_records_t ON nut_pediatric_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS nut_admin_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE nut_admin_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE nut_admin_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nut_admin_records_t ON nut_admin_records;
CREATE POLICY nut_admin_records_t ON nut_admin_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
