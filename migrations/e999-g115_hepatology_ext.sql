-- migrations/e999-g115_hepatology_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS hepatology_viral_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE hepatology_viral_records ENABLE ROW LEVEL SECURITY; ALTER TABLE hepatology_viral_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hepatology_viral_records_t ON hepatology_viral_records; CREATE POLICY hepatology_viral_records_t ON hepatology_viral_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS hepatology_cirrhosis_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE hepatology_cirrhosis_records ENABLE ROW LEVEL SECURITY; ALTER TABLE hepatology_cirrhosis_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hepatology_cirrhosis_records_t ON hepatology_cirrhosis_records; CREATE POLICY hepatology_cirrhosis_records_t ON hepatology_cirrhosis_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS hepatology_liver_failure_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE hepatology_liver_failure_records ENABLE ROW LEVEL SECURITY; ALTER TABLE hepatology_liver_failure_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hepatology_liver_failure_records_t ON hepatology_liver_failure_records; CREATE POLICY hepatology_liver_failure_records_t ON hepatology_liver_failure_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS hepatology_pediatric_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE hepatology_pediatric_records ENABLE ROW LEVEL SECURITY; ALTER TABLE hepatology_pediatric_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hepatology_pediatric_records_t ON hepatology_pediatric_records; CREATE POLICY hepatology_pediatric_records_t ON hepatology_pediatric_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS hepatology_metabolic_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE hepatology_metabolic_records ENABLE ROW LEVEL SECURITY; ALTER TABLE hepatology_metabolic_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hepatology_metabolic_records_t ON hepatology_metabolic_records; CREATE POLICY hepatology_metabolic_records_t ON hepatology_metabolic_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
