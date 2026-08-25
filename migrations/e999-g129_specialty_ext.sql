-- migrations/e999-g129_specialty_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS pain_mgmt_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pain_mgmt_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pain_mgmt_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pain_mgmt_records_t ON pain_mgmt_records; CREATE POLICY pain_mgmt_records_t ON pain_mgmt_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS palliative_care_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE palliative_care_records ENABLE ROW LEVEL SECURITY; ALTER TABLE palliative_care_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS palliative_care_records_t ON palliative_care_records; CREATE POLICY palliative_care_records_t ON palliative_care_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS spine_care_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE spine_care_records ENABLE ROW LEVEL SECURITY; ALTER TABLE spine_care_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS spine_care_records_t ON spine_care_records; CREATE POLICY spine_care_records_t ON spine_care_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS sports_medicine_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE sports_medicine_records ENABLE ROW LEVEL SECURITY; ALTER TABLE sports_medicine_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sports_medicine_records_t ON sports_medicine_records; CREATE POLICY sports_medicine_records_t ON sports_medicine_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS sleep_medicine_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE sleep_medicine_records ENABLE ROW LEVEL SECURITY; ALTER TABLE sleep_medicine_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sleep_medicine_records_t ON sleep_medicine_records; CREATE POLICY sleep_medicine_records_t ON sleep_medicine_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);