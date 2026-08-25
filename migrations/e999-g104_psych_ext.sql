-- migrations/e999-g104_psych_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS psych_general_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE psych_general_records ENABLE ROW LEVEL SECURITY; ALTER TABLE psych_general_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psych_general_records_t ON psych_general_records; CREATE POLICY psych_general_records_t ON psych_general_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS psych_anxiety_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE psych_anxiety_records ENABLE ROW LEVEL SECURITY; ALTER TABLE psych_anxiety_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psych_anxiety_records_t ON psych_anxiety_records; CREATE POLICY psych_anxiety_records_t ON psych_anxiety_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS psych_mood_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE psych_mood_records ENABLE ROW LEVEL SECURITY; ALTER TABLE psych_mood_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psych_mood_records_t ON psych_mood_records; CREATE POLICY psych_mood_records_t ON psych_mood_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS psych_sud_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE psych_sud_records ENABLE ROW LEVEL SECURITY; ALTER TABLE psych_sud_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psych_sud_records_t ON psych_sud_records; CREATE POLICY psych_sud_records_t ON psych_sud_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS psych_emerg_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE psych_emerg_records ENABLE ROW LEVEL SECURITY; ALTER TABLE psych_emerg_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS psych_emerg_records_t ON psych_emerg_records; CREATE POLICY psych_emerg_records_t ON psych_emerg_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
