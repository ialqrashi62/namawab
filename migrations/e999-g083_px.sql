-- migrations/e999-g083_px.sql
-- TIER63 Patient Experience 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS px_satis_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE px_satis_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE px_satis_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS px_satis_records_t ON px_satis_records;
CREATE POLICY px_satis_records_t ON px_satis_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS px_engage_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE px_engage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE px_engage_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS px_engage_records_t ON px_engage_records;
CREATE POLICY px_engage_records_t ON px_engage_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS px_access_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE px_access_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE px_access_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS px_access_records_t ON px_access_records;
CREATE POLICY px_access_records_t ON px_access_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS px_feedback_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE px_feedback_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE px_feedback_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS px_feedback_records_t ON px_feedback_records;
CREATE POLICY px_feedback_records_t ON px_feedback_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS px_journey_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE px_journey_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE px_journey_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS px_journey_records_t ON px_journey_records;
CREATE POLICY px_journey_records_t ON px_journey_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
