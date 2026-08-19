-- migrations/e999-g119_multispec_final.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS icu_extended_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE icu_extended_records ENABLE ROW LEVEL SECURITY; ALTER TABLE icu_extended_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS icu_extended_records_t ON icu_extended_records; CREATE POLICY icu_extended_records_t ON icu_extended_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS ed_extended_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE ed_extended_records ENABLE ROW LEVEL SECURITY; ALTER TABLE ed_extended_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ed_extended_records_t ON ed_extended_records; CREATE POLICY ed_extended_records_t ON ed_extended_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS perioperative_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE perioperative_records ENABLE ROW LEVEL SECURITY; ALTER TABLE perioperative_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS perioperative_records_t ON perioperative_records; CREATE POLICY perioperative_records_t ON perioperative_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS rehab_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE rehab_records ENABLE ROW LEVEL SECURITY; ALTER TABLE rehab_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rehab_records_t ON rehab_records; CREATE POLICY rehab_records_t ON rehab_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS oncology_extended_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE oncology_extended_records ENABLE ROW LEVEL SECURITY; ALTER TABLE oncology_extended_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS oncology_extended_records_t ON oncology_extended_records; CREATE POLICY oncology_extended_records_t ON oncology_extended_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
