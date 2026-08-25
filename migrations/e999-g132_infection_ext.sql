-- migrations/e999-g132_infection_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS infection_control_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE infection_control_records ENABLE ROW LEVEL SECURITY; ALTER TABLE infection_control_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS infection_control_records_t ON infection_control_records; CREATE POLICY infection_control_records_t ON infection_control_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS pathogen_tracking_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pathogen_tracking_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pathogen_tracking_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pathogen_tracking_records_t ON pathogen_tracking_records; CREATE POLICY pathogen_tracking_records_t ON pathogen_tracking_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS immunization_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE immunization_records ENABLE ROW LEVEL SECURITY; ALTER TABLE immunization_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS immunization_records_t ON immunization_records; CREATE POLICY immunization_records_t ON immunization_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS sterilization_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE sterilization_records ENABLE ROW LEVEL SECURITY; ALTER TABLE sterilization_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sterilization_records_t ON sterilization_records; CREATE POLICY sterilization_records_t ON sterilization_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS stew_extended_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE stew_extended_records ENABLE ROW LEVEL SECURITY; ALTER TABLE stew_extended_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS stew_extended_records_t ON stew_extended_records; CREATE POLICY stew_extended_records_t ON stew_extended_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);