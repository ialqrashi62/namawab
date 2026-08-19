-- migrations/e999-g133_womens_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS ob_extended_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE ob_extended_records ENABLE ROW LEVEL SECURITY; ALTER TABLE ob_extended_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ob_extended_records_t ON ob_extended_records; CREATE POLICY ob_extended_records_t ON ob_extended_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS maternal_med_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE maternal_med_records ENABLE ROW LEVEL SECURITY; ALTER TABLE maternal_med_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS maternal_med_records_t ON maternal_med_records; CREATE POLICY maternal_med_records_t ON maternal_med_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS reproductive_endocrine_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE reproductive_endocrine_records ENABLE ROW LEVEL SECURITY; ALTER TABLE reproductive_endocrine_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS reproductive_endocrine_records_t ON reproductive_endocrine_records; CREATE POLICY reproductive_endocrine_records_t ON reproductive_endocrine_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS fertility_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE fertility_records ENABLE ROW LEVEL SECURITY; ALTER TABLE fertility_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS fertility_records_t ON fertility_records; CREATE POLICY fertility_records_t ON fertility_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS gyne_onc_extended_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE gyne_onc_extended_records ENABLE ROW LEVEL SECURITY; ALTER TABLE gyne_onc_extended_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS gyne_onc_extended_records_t ON gyne_onc_extended_records; CREATE POLICY gyne_onc_extended_records_t ON gyne_onc_extended_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);