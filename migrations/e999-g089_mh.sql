-- migrations/e999-g089_mh.sql
-- TIER69 Mental Health Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS mh_assess_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE mh_assess_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mh_assess_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mh_assess_records_t ON mh_assess_records;
CREATE POLICY mh_assess_records_t ON mh_assess_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS mh_therapy_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE mh_therapy_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mh_therapy_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mh_therapy_records_t ON mh_therapy_records;
CREATE POLICY mh_therapy_records_t ON mh_therapy_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS mh_psychopharm_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE mh_psychopharm_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mh_psychopharm_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mh_psychopharm_records_t ON mh_psychopharm_records;
CREATE POLICY mh_psychopharm_records_t ON mh_psychopharm_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS mh_addiction_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE mh_addiction_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mh_addiction_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mh_addiction_records_t ON mh_addiction_records;
CREATE POLICY mh_addiction_records_t ON mh_addiction_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS mh_community_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE mh_community_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mh_community_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mh_community_records_t ON mh_community_records;
CREATE POLICY mh_community_records_t ON mh_community_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
