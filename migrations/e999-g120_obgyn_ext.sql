-- migrations/e999-g120_obgyn_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS obgyn_mfm_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE obgyn_mfm_records ENABLE ROW LEVEL SECURITY; ALTER TABLE obgyn_mfm_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_mfm_records_t ON obgyn_mfm_records; CREATE POLICY obgyn_mfm_records_t ON obgyn_mfm_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS obgyn_gyn_onc_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE obgyn_gyn_onc_records ENABLE ROW LEVEL SECURITY; ALTER TABLE obgyn_gyn_onc_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_gyn_onc_records_t ON obgyn_gyn_onc_records; CREATE POLICY obgyn_gyn_onc_records_t ON obgyn_gyn_onc_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS obgyn_rei_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE obgyn_rei_records ENABLE ROW LEVEL SECURITY; ALTER TABLE obgyn_rei_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_rei_records_t ON obgyn_rei_records; CREATE POLICY obgyn_rei_records_t ON obgyn_rei_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS obgyn_menopause_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE obgyn_menopause_records ENABLE ROW LEVEL SECURITY; ALTER TABLE obgyn_menopause_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_menopause_records_t ON obgyn_menopause_records; CREATE POLICY obgyn_menopause_records_t ON obgyn_menopause_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS obgyn_reproductive_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE obgyn_reproductive_records ENABLE ROW LEVEL SECURITY; ALTER TABLE obgyn_reproductive_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_reproductive_records_t ON obgyn_reproductive_records; CREATE POLICY obgyn_reproductive_records_t ON obgyn_reproductive_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
