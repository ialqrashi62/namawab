-- migrations/e999-g079_telemedicine.sql
-- TIER59 Telemedicine 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS tele_visit_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  provider TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tele_visit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tele_visit_logs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tele_visit_logs_t ON tele_visit_logs;
CREATE POLICY tele_visit_logs_t ON tele_visit_logs USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS tele_monitoring_data (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  device TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tele_monitoring_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE tele_monitoring_data FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tele_monitoring_data_t ON tele_monitoring_data;
CREATE POLICY tele_monitoring_data_t ON tele_monitoring_data USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS tele_surgical_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  procedure TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tele_surgical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE tele_surgical_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tele_surgical_records_t ON tele_surgical_records;
CREATE POLICY tele_surgical_records_t ON tele_surgical_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS tele_psychiatry_sessions (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  modality TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tele_psychiatry_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tele_psychiatry_sessions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tele_psychiatry_sessions_t ON tele_psychiatry_sessions;
CREATE POLICY tele_psychiatry_sessions_t ON tele_psychiatry_sessions USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS tele_admin_audit (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE tele_admin_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE tele_admin_audit FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tele_admin_audit_t ON tele_admin_audit;
CREATE POLICY tele_admin_audit_t ON tele_admin_audit USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
