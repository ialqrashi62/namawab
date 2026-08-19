-- migrations/e999-g125_admin_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS scheduling_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE scheduling_records ENABLE ROW LEVEL SECURITY; ALTER TABLE scheduling_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS scheduling_records_t ON scheduling_records; CREATE POLICY scheduling_records_t ON scheduling_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS billing_ext_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE billing_ext_records ENABLE ROW LEVEL SECURITY; ALTER TABLE billing_ext_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS billing_ext_records_t ON billing_ext_records; CREATE POLICY billing_ext_records_t ON billing_ext_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS insurance_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE insurance_records ENABLE ROW LEVEL SECURITY; ALTER TABLE insurance_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS insurance_records_t ON insurance_records; CREATE POLICY insurance_records_t ON insurance_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS administrative_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE administrative_records ENABLE ROW LEVEL SECURITY; ALTER TABLE administrative_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS administrative_records_t ON administrative_records; CREATE POLICY administrative_records_t ON administrative_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS communication_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE communication_records ENABLE ROW LEVEL SECURITY; ALTER TABLE communication_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS communication_records_t ON communication_records; CREATE POLICY communication_records_t ON communication_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);