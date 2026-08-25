-- migrations/e999-g114_pulmonology_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS pulm_function_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pulm_function_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pulm_function_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_function_records_t ON pulm_function_records; CREATE POLICY pulm_function_records_t ON pulm_function_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS pulm_sleep_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pulm_sleep_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pulm_sleep_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_sleep_records_t ON pulm_sleep_records; CREATE POLICY pulm_sleep_records_t ON pulm_sleep_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS pulm_interstitial_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pulm_interstitial_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pulm_interstitial_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_interstitial_records_t ON pulm_interstitial_records; CREATE POLICY pulm_interstitial_records_t ON pulm_interstitial_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS pulm_vascular_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pulm_vascular_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pulm_vascular_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_vascular_records_t ON pulm_vascular_records; CREATE POLICY pulm_vascular_records_t ON pulm_vascular_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS pulm_pleural_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pulm_pleural_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pulm_pleural_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pulm_pleural_records_t ON pulm_pleural_records; CREATE POLICY pulm_pleural_records_t ON pulm_pleural_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
