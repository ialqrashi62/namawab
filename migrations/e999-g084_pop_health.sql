-- migrations/e999-g084_pop_health.sql
-- TIER64 Population Health 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS pop_registry_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  registry_type TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pop_registry_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pop_registry_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pop_registry_records_t ON pop_registry_records;
CREATE POLICY pop_registry_records_t ON pop_registry_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS pop_screening_results (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  screening_type TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pop_screening_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE pop_screening_results FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pop_screening_results_t ON pop_screening_results;
CREATE POLICY pop_screening_results_t ON pop_screening_results USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS pop_cohort_definitions (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  cohort_name TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pop_cohort_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pop_cohort_definitions FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pop_cohort_definitions_t ON pop_cohort_definitions;
CREATE POLICY pop_cohort_definitions_t ON pop_cohort_definitions USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS pop_outreach_logs (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  channel TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pop_outreach_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pop_outreach_logs FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pop_outreach_logs_t ON pop_outreach_logs;
CREATE POLICY pop_outreach_logs_t ON pop_outreach_logs USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS pop_metrics_snapshots (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  metric TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pop_metrics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE pop_metrics_snapshots FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pop_metrics_snapshots_t ON pop_metrics_snapshots;
CREATE POLICY pop_metrics_snapshots_t ON pop_metrics_snapshots USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
