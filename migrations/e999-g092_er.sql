-- migrations/e999-g092_er.sql
-- TIER72 Emergency Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS er_triage_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE er_triage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_triage_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_triage_records_t ON er_triage_records;
CREATE POLICY er_triage_records_t ON er_triage_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS er_resus_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE er_resus_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_resus_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_resus_records_t ON er_resus_records;
CREATE POLICY er_resus_records_t ON er_resus_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS er_medic_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE er_medic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_medic_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_medic_records_t ON er_medic_records;
CREATE POLICY er_medic_records_t ON er_medic_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS er_trauma_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE er_trauma_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_trauma_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_trauma_records_t ON er_trauma_records;
CREATE POLICY er_trauma_records_t ON er_trauma_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS er_dispos_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE er_dispos_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_dispos_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_dispos_records_t ON er_dispos_records;
CREATE POLICY er_dispos_records_t ON er_dispos_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
