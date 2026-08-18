-- migrations/e999-g087_surg_periop.sql
-- TIER67 Surgical Peri-op Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS surg_pre_admit_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  case_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE surg_pre_admit_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_pre_admit_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS surg_pre_admit_records_t ON surg_pre_admit_records;
CREATE POLICY surg_pre_admit_records_t ON surg_pre_admit_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS surg_intraop_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  case_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE surg_intraop_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_intraop_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS surg_intraop_records_t ON surg_intraop_records;
CREATE POLICY surg_intraop_records_t ON surg_intraop_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS surg_postop_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  case_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE surg_postop_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_postop_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS surg_postop_records_t ON surg_postop_records;
CREATE POLICY surg_postop_records_t ON surg_postop_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS surg_complications_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  case_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE surg_complications_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_complications_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS surg_complications_records_t ON surg_complications_records;
CREATE POLICY surg_complications_records_t ON surg_complications_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS surg_quality_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  case_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE surg_quality_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE surg_quality_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS surg_quality_records_t ON surg_quality_records;
CREATE POLICY surg_quality_records_t ON surg_quality_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
