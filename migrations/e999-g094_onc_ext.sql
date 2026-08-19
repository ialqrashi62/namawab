-- migrations/e999-g094_onc_ext.sql
-- TIER74 Oncology Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS onc_ext_treat_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE onc_ext_treat_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_ext_treat_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_ext_treat_records_t ON onc_ext_treat_records;
CREATE POLICY onc_ext_treat_records_t ON onc_ext_treat_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS onc_ext_followup_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE onc_ext_followup_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_ext_followup_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_ext_followup_records_t ON onc_ext_followup_records;
CREATE POLICY onc_ext_followup_records_t ON onc_ext_followup_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS onc_ext_special_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE onc_ext_special_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_ext_special_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_ext_special_records_t ON onc_ext_special_records;
CREATE POLICY onc_ext_special_records_t ON onc_ext_special_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS onc_ext_symptom_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE onc_ext_symptom_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_ext_symptom_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_ext_symptom_records_t ON onc_ext_symptom_records;
CREATE POLICY onc_ext_symptom_records_t ON onc_ext_symptom_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS onc_ext_support_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE onc_ext_support_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE onc_ext_support_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS onc_ext_support_records_t ON onc_ext_support_records;
CREATE POLICY onc_ext_support_records_t ON onc_ext_support_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
