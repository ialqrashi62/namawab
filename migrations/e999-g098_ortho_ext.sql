-- migrations/e999-g098_ortho_ext.sql
-- TIER78 Orthopedics Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS ortho_trauma_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ortho_trauma_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_trauma_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_trauma_records_t ON ortho_trauma_records;
CREATE POLICY ortho_trauma_records_t ON ortho_trauma_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ortho_joint_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ortho_joint_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_joint_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_joint_records_t ON ortho_joint_records;
CREATE POLICY ortho_joint_records_t ON ortho_joint_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ortho_spine_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ortho_spine_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_spine_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_spine_records_t ON ortho_spine_records;
CREATE POLICY ortho_spine_records_t ON ortho_spine_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ortho_sports_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ortho_sports_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_sports_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_sports_records_t ON ortho_sports_records;
CREATE POLICY ortho_sports_records_t ON ortho_sports_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ortho_pediatric_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ortho_pediatric_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ortho_pediatric_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ortho_pediatric_records_t ON ortho_pediatric_records;
CREATE POLICY ortho_pediatric_records_t ON ortho_pediatric_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
