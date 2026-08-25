-- migrations/e999-g086_lab_diag.sql
-- TIER66 Lab Diagnostics Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS lab_specimen_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  specimen_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE lab_specimen_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_specimen_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lab_specimen_records_t ON lab_specimen_records;
CREATE POLICY lab_specimen_records_t ON lab_specimen_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS lab_result_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  result_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE lab_result_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_result_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lab_result_records_t ON lab_result_records;
CREATE POLICY lab_result_records_t ON lab_result_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS lab_micro_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  culture_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE lab_micro_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_micro_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lab_micro_records_t ON lab_micro_records;
CREATE POLICY lab_micro_records_t ON lab_micro_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS lab_path_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  specimen_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE lab_path_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_path_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lab_path_records_t ON lab_path_records;
CREATE POLICY lab_path_records_t ON lab_path_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS lab_qc_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE lab_qc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_qc_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lab_qc_records_t ON lab_qc_records;
CREATE POLICY lab_qc_records_t ON lab_qc_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
