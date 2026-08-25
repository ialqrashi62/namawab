-- migrations/e999-g128_imaging_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS ct_advanced_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE ct_advanced_records ENABLE ROW LEVEL SECURITY; ALTER TABLE ct_advanced_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ct_advanced_records_t ON ct_advanced_records; CREATE POLICY ct_advanced_records_t ON ct_advanced_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS mri_advanced_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE mri_advanced_records ENABLE ROW LEVEL SECURITY; ALTER TABLE mri_advanced_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mri_advanced_records_t ON mri_advanced_records; CREATE POLICY mri_advanced_records_t ON mri_advanced_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS ultrasound_advanced_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE ultrasound_advanced_records ENABLE ROW LEVEL SECURITY; ALTER TABLE ultrasound_advanced_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ultrasound_advanced_records_t ON ultrasound_advanced_records; CREATE POLICY ultrasound_advanced_records_t ON ultrasound_advanced_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS imaging_ai_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE imaging_ai_records ENABLE ROW LEVEL SECURITY; ALTER TABLE imaging_ai_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS imaging_ai_records_t ON imaging_ai_records; CREATE POLICY imaging_ai_records_t ON imaging_ai_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS imaging_quality_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE imaging_quality_records ENABLE ROW LEVEL SECURITY; ALTER TABLE imaging_quality_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS imaging_quality_records_t ON imaging_quality_records; CREATE POLICY imaging_quality_records_t ON imaging_quality_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);