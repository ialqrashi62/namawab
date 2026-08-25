-- migrations/e999-g110_genetics_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS genetics_cancer_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE genetics_cancer_records ENABLE ROW LEVEL SECURITY; ALTER TABLE genetics_cancer_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS genetics_cancer_records_t ON genetics_cancer_records; CREATE POLICY genetics_cancer_records_t ON genetics_cancer_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS genetics_rare_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE genetics_rare_records ENABLE ROW LEVEL SECURITY; ALTER TABLE genetics_rare_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS genetics_rare_records_t ON genetics_rare_records; CREATE POLICY genetics_rare_records_t ON genetics_rare_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS genetics_adult_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE genetics_adult_records ENABLE ROW LEVEL SECURITY; ALTER TABLE genetics_adult_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS genetics_adult_records_t ON genetics_adult_records; CREATE POLICY genetics_adult_records_t ON genetics_adult_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS genetics_counseling_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE genetics_counseling_records ENABLE ROW LEVEL SECURITY; ALTER TABLE genetics_counseling_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS genetics_counseling_records_t ON genetics_counseling_records; CREATE POLICY genetics_counseling_records_t ON genetics_counseling_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS genetics_lab_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE genetics_lab_records ENABLE ROW LEVEL SECURITY; ALTER TABLE genetics_lab_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS genetics_lab_records_t ON genetics_lab_records; CREATE POLICY genetics_lab_records_t ON genetics_lab_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
