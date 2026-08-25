-- migrations/e999-g127_nursing_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS nursing_assess_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE nursing_assess_records ENABLE ROW LEVEL SECURITY; ALTER TABLE nursing_assess_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nursing_assess_records_t ON nursing_assess_records; CREATE POLICY nursing_assess_records_t ON nursing_assess_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS nursing_med_admin_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE nursing_med_admin_records ENABLE ROW LEVEL SECURITY; ALTER TABLE nursing_med_admin_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS nursing_med_admin_records_t ON nursing_med_admin_records; CREATE POLICY nursing_med_admin_records_t ON nursing_med_admin_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS wound_care_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE wound_care_records ENABLE ROW LEVEL SECURITY; ALTER TABLE wound_care_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS wound_care_records_t ON wound_care_records; CREATE POLICY wound_care_records_t ON wound_care_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS iv_therapy_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE iv_therapy_records ENABLE ROW LEVEL SECURITY; ALTER TABLE iv_therapy_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS iv_therapy_records_t ON iv_therapy_records; CREATE POLICY iv_therapy_records_t ON iv_therapy_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS allied_health_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE allied_health_records ENABLE ROW LEVEL SECURITY; ALTER TABLE allied_health_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allied_health_records_t ON allied_health_records; CREATE POLICY allied_health_records_t ON allied_health_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);