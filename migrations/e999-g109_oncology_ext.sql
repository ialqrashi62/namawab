-- migrations/e999-g109_oncology_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS oncology_chemo_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE oncology_chemo_records ENABLE ROW LEVEL SECURITY; ALTER TABLE oncology_chemo_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS oncology_chemo_records_t ON oncology_chemo_records; CREATE POLICY oncology_chemo_records_t ON oncology_chemo_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS oncology_radiation_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE oncology_radiation_records ENABLE ROW LEVEL SECURITY; ALTER TABLE oncology_radiation_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS oncology_radiation_records_t ON oncology_radiation_records; CREATE POLICY oncology_radiation_records_t ON oncology_radiation_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS hematology_benign_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE hematology_benign_records ENABLE ROW LEVEL SECURITY; ALTER TABLE hematology_benign_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS hematology_benign_records_t ON hematology_benign_records; CREATE POLICY hematology_benign_records_t ON hematology_benign_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS oncology_support_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE oncology_support_records ENABLE ROW LEVEL SECURITY; ALTER TABLE oncology_support_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS oncology_support_records_t ON oncology_support_records; CREATE POLICY oncology_support_records_t ON oncology_support_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS oncology_survivorship_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE oncology_survivorship_records ENABLE ROW LEVEL SECURITY; ALTER TABLE oncology_survivorship_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS oncology_survivorship_records_t ON oncology_survivorship_records; CREATE POLICY oncology_survivorship_records_t ON oncology_survivorship_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
