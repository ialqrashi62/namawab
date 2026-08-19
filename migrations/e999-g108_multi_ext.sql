-- migrations/e999-g108_multi_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS id_general_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE id_general_records ENABLE ROW LEVEL SECURITY; ALTER TABLE id_general_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS id_general_records_t ON id_general_records; CREATE POLICY id_general_records_t ON id_general_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS id_syndromes_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE id_syndromes_records ENABLE ROW LEVEL SECURITY; ALTER TABLE id_syndromes_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS id_syndromes_records_t ON id_syndromes_records; CREATE POLICY id_syndromes_records_t ON id_syndromes_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS gi_luminal_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE gi_luminal_records ENABLE ROW LEVEL SECURITY; ALTER TABLE gi_luminal_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gi_luminal_records_t ON gi_luminal_records; CREATE POLICY gi_luminal_records_t ON gi_luminal_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS gi_liver_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE gi_liver_records ENABLE ROW LEVEL SECURITY; ALTER TABLE gi_liver_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gi_liver_records_t ON gi_liver_records; CREATE POLICY gi_liver_records_t ON gi_liver_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS id_specialty_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE id_specialty_records ENABLE ROW LEVEL SECURITY; ALTER TABLE id_specialty_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS id_specialty_records_t ON id_specialty_records; CREATE POLICY id_specialty_records_t ON id_specialty_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
