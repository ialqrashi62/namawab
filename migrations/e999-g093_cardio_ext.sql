-- migrations/e999-g093_cardio_ext.sql
-- TIER73 Cardiology Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS cardio_ep_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE cardio_ep_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_ep_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_ep_records_t ON cardio_ep_records;
CREATE POLICY cardio_ep_records_t ON cardio_ep_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS cardio_imaging_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  study_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE cardio_imaging_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_imaging_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_imaging_records_t ON cardio_imaging_records;
CREATE POLICY cardio_imaging_records_t ON cardio_imaging_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS cardio_chf_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE cardio_chf_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_chf_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_chf_records_t ON cardio_chf_records;
CREATE POLICY cardio_chf_records_t ON cardio_chf_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS cardio_rehab_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE cardio_rehab_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_rehab_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_rehab_records_t ON cardio_rehab_records;
CREATE POLICY cardio_rehab_records_t ON cardio_rehab_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS cardio_prevention_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE cardio_prevention_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_prevention_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_prevention_records_t ON cardio_prevention_records;
CREATE POLICY cardio_prevention_records_t ON cardio_prevention_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
