-- migrations/e999-g090_img_diag.sql
-- TIER70 Imaging Diagnostics Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS img_proc_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  study_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE img_proc_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE img_proc_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS img_proc_records_t ON img_proc_records;
CREATE POLICY img_proc_records_t ON img_proc_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS img_interp_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  study_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE img_interp_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE img_interp_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS img_interp_records_t ON img_interp_records;
CREATE POLICY img_interp_records_t ON img_interp_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS img_admin_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE img_admin_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE img_admin_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS img_admin_records_t ON img_admin_records;
CREATE POLICY img_admin_records_t ON img_admin_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS img_specialty_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  study_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE img_specialty_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE img_specialty_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS img_specialty_records_t ON img_specialty_records;
CREATE POLICY img_specialty_records_t ON img_specialty_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS img_safety_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE img_safety_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE img_safety_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS img_safety_records_t ON img_safety_records;
CREATE POLICY img_safety_records_t ON img_safety_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
