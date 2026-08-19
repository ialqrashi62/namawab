-- migrations/e999-g118_cardio_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS cardio_acute_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE cardio_acute_records ENABLE ROW LEVEL SECURITY; ALTER TABLE cardio_acute_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_acute_records_t ON cardio_acute_records; CREATE POLICY cardio_acute_records_t ON cardio_acute_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS cardio_imaging_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE cardio_imaging_records ENABLE ROW LEVEL SECURITY; ALTER TABLE cardio_imaging_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_imaging_records_t ON cardio_imaging_records; CREATE POLICY cardio_imaging_records_t ON cardio_imaging_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS cardio_intervention_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE cardio_intervention_records ENABLE ROW LEVEL SECURITY; ALTER TABLE cardio_intervention_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_intervention_records_t ON cardio_intervention_records; CREATE POLICY cardio_intervention_records_t ON cardio_intervention_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS cardio_ep_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE cardio_ep_records ENABLE ROW LEVEL SECURITY; ALTER TABLE cardio_ep_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_ep_records_t ON cardio_ep_records; CREATE POLICY cardio_ep_records_t ON cardio_ep_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS cardio_valve_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE cardio_valve_records ENABLE ROW LEVEL SECURITY; ALTER TABLE cardio_valve_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_valve_records_t ON cardio_valve_records; CREATE POLICY cardio_valve_records_t ON cardio_valve_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
