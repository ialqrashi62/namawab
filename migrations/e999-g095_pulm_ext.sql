-- migrations/e999-g095_pulm_ext.sql
-- TIER75 Pulmonology Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS pulm_assess_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  study_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pulm_assess_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_assess_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_assess_records_t ON pulm_assess_records;
CREATE POLICY pulm_assess_records_t ON pulm_assess_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS pulm_disease_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pulm_disease_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_disease_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_disease_records_t ON pulm_disease_records;
CREATE POLICY pulm_disease_records_t ON pulm_disease_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS pulm_proc_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  procedure_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pulm_proc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_proc_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_proc_records_t ON pulm_proc_records;
CREATE POLICY pulm_proc_records_t ON pulm_proc_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS pulm_special_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pulm_special_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_special_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_special_records_t ON pulm_special_records;
CREATE POLICY pulm_special_records_t ON pulm_special_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS pulm_icu_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pulm_icu_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pulm_icu_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_icu_records_t ON pulm_icu_records;
CREATE POLICY pulm_icu_records_t ON pulm_icu_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
