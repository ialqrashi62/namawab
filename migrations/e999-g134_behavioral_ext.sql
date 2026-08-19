-- migrations/e999-g134_behavioral_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS anxiety_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE anxiety_records ENABLE ROW LEVEL SECURITY; ALTER TABLE anxiety_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anxiety_records_t ON anxiety_records; CREATE POLICY anxiety_records_t ON anxiety_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS mood_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE mood_records ENABLE ROW LEVEL SECURITY; ALTER TABLE mood_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS mood_records_t ON mood_records; CREATE POLICY mood_records_t ON mood_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS psychotic_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE psychotic_records ENABLE ROW LEVEL SECURITY; ALTER TABLE psychotic_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psychotic_records_t ON psychotic_records; CREATE POLICY psychotic_records_t ON psychotic_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS trauma_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE trauma_records ENABLE ROW LEVEL SECURITY; ALTER TABLE trauma_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS trauma_records_t ON trauma_records; CREATE POLICY trauma_records_t ON trauma_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS substance_use_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE substance_use_records ENABLE ROW LEVEL SECURITY; ALTER TABLE substance_use_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS substance_use_records_t ON substance_use_records; CREATE POLICY substance_use_records_t ON substance_use_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);