-- migrations/e999-g135_surgical_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS neurosurgery_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neurosurgery_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neurosurgery_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neurosurgery_records_t ON neurosurgery_records; CREATE POLICY neurosurgery_records_t ON neurosurgery_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS orthopedics_ext_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE orthopedics_ext_records ENABLE ROW LEVEL SECURITY; ALTER TABLE orthopedics_ext_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS orthopedics_ext_records_t ON orthopedics_ext_records; CREATE POLICY orthopedics_ext_records_t ON orthopedics_ext_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS otolaryngology_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE otolaryngology_records ENABLE ROW LEVEL SECURITY; ALTER TABLE otolaryngology_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS otolaryngology_records_t ON otolaryngology_records; CREATE POLICY otolaryngology_records_t ON otolaryngology_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS ophthalmology_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE ophthalmology_records ENABLE ROW LEVEL SECURITY; ALTER TABLE ophthalmology_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ophthalmology_records_t ON ophthalmology_records; CREATE POLICY ophthalmology_records_t ON ophthalmology_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS dentistry_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE dentistry_records ENABLE ROW LEVEL SECURITY; ALTER TABLE dentistry_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dentistry_records_t ON dentistry_records; CREATE POLICY dentistry_records_t ON dentistry_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);