-- migrations/e999-g121_peds_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS peds_neonatal_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE peds_neonatal_records ENABLE ROW LEVEL SECURITY; ALTER TABLE peds_neonatal_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_neonatal_records_t ON peds_neonatal_records; CREATE POLICY peds_neonatal_records_t ON peds_neonatal_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS peds_picu_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE peds_picu_records ENABLE ROW LEVEL SECURITY; ALTER TABLE peds_picu_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_picu_records_t ON peds_picu_records; CREATE POLICY peds_picu_records_t ON peds_picu_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS peds_cardiology_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE peds_cardiology_records ENABLE ROW LEVEL SECURITY; ALTER TABLE peds_cardiology_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_cardiology_records_t ON peds_cardiology_records; CREATE POLICY peds_cardiology_records_t ON peds_cardiology_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS peds_pulmonology_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE peds_pulmonology_records ENABLE ROW LEVEL SECURITY; ALTER TABLE peds_pulmonology_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_pulmonology_records_t ON peds_pulmonology_records; CREATE POLICY peds_pulmonology_records_t ON peds_pulmonology_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS peds_development_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE peds_development_records ENABLE ROW LEVEL SECURITY; ALTER TABLE peds_development_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS peds_development_records_t ON peds_development_records; CREATE POLICY peds_development_records_t ON peds_development_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
