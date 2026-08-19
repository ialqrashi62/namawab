-- migrations/e999-g112_immunology_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS immunodeficiency_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE immunodeficiency_records ENABLE ROW LEVEL SECURITY; ALTER TABLE immunodeficiency_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS immunodeficiency_records_t ON immunodeficiency_records; CREATE POLICY immunodeficiency_records_t ON immunodeficiency_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS allergy_clinical_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE allergy_clinical_records ENABLE ROW LEVEL SECURITY; ALTER TABLE allergy_clinical_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allergy_clinical_records_t ON allergy_clinical_records; CREATE POLICY allergy_clinical_records_t ON allergy_clinical_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS immunology_lab_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE immunology_lab_records ENABLE ROW LEVEL SECURITY; ALTER TABLE immunology_lab_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS immunology_lab_records_t ON immunology_lab_records; CREATE POLICY immunology_lab_records_t ON immunology_lab_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS immunotherapy_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE immunotherapy_records ENABLE ROW LEVEL SECURITY; ALTER TABLE immunotherapy_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS immunotherapy_records_t ON immunotherapy_records; CREATE POLICY immunotherapy_records_t ON immunotherapy_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS autoimmune_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE autoimmune_records ENABLE ROW LEVEL SECURITY; ALTER TABLE autoimmune_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS autoimmune_records_t ON autoimmune_records; CREATE POLICY autoimmune_records_t ON autoimmune_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
