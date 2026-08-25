-- migrations/e999-g082_spec_care_ext.sql
-- TIER62 Specialty Care Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS sp_geri_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE sp_geri_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sp_geri_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sp_geri_records_t ON sp_geri_records;
CREATE POLICY sp_geri_records_t ON sp_geri_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS sp_pall_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE sp_pall_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sp_pall_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sp_pall_records_t ON sp_pall_records;
CREATE POLICY sp_pall_records_t ON sp_pall_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS sp_home_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE sp_home_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sp_home_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sp_home_records_t ON sp_home_records;
CREATE POLICY sp_home_records_t ON sp_home_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS sp_rehab_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE sp_rehab_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sp_rehab_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sp_rehab_records_t ON sp_rehab_records;
CREATE POLICY sp_rehab_records_t ON sp_rehab_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS sp_mat_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE sp_mat_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sp_mat_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sp_mat_records_t ON sp_mat_records;
CREATE POLICY sp_mat_records_t ON sp_mat_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
