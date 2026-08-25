-- migrations/e999-g136_allied_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS pt_extended_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pt_extended_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pt_extended_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pt_extended_records_t ON pt_extended_records; CREATE POLICY pt_extended_records_t ON pt_extended_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS ot_extended_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE ot_extended_records ENABLE ROW LEVEL SECURITY; ALTER TABLE ot_extended_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ot_extended_records_t ON ot_extended_records; CREATE POLICY ot_extended_records_t ON ot_extended_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS st_voice_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE st_voice_records ENABLE ROW LEVEL SECURITY; ALTER TABLE st_voice_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS st_voice_records_t ON st_voice_records; CREATE POLICY st_voice_records_t ON st_voice_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS rehab_engineering_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE rehab_engineering_records ENABLE ROW LEVEL SECURITY; ALTER TABLE rehab_engineering_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_engineering_records_t ON rehab_engineering_records; CREATE POLICY rehab_engineering_records_t ON rehab_engineering_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS specialty_rehab_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE specialty_rehab_records ENABLE ROW LEVEL SECURITY; ALTER TABLE specialty_rehab_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS specialty_rehab_records_t ON specialty_rehab_records; CREATE POLICY specialty_rehab_records_t ON specialty_rehab_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);