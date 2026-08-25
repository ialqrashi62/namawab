-- migrations/e999-g123_diagnostic_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS pathology_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pathology_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pathology_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pathology_records_t ON pathology_records; CREATE POLICY pathology_records_t ON pathology_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS radiology_extended_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE radiology_extended_records ENABLE ROW LEVEL SECURITY; ALTER TABLE radiology_extended_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS radiology_extended_records_t ON radiology_extended_records; CREATE POLICY radiology_extended_records_t ON radiology_extended_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS nuclear_medicine_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE nuclear_medicine_records ENABLE ROW LEVEL SECURITY; ALTER TABLE nuclear_medicine_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nuclear_medicine_records_t ON nuclear_medicine_records; CREATE POLICY nuclear_medicine_records_t ON nuclear_medicine_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS lab_management_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE lab_management_records ENABLE ROW LEVEL SECURITY; ALTER TABLE lab_management_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lab_management_records_t ON lab_management_records; CREATE POLICY lab_management_records_t ON lab_management_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS blood_bank_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE blood_bank_records ENABLE ROW LEVEL SECURITY; ALTER TABLE blood_bank_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS blood_bank_records_t ON blood_bank_records; CREATE POLICY blood_bank_records_t ON blood_bank_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
