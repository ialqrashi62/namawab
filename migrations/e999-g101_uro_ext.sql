-- migrations/e999-g101_uro_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS uro_general_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE uro_general_records ENABLE ROW LEVEL SECURITY; ALTER TABLE uro_general_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS uro_general_records_t ON uro_general_records; CREATE POLICY uro_general_records_t ON uro_general_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS uro_renal_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE uro_renal_records ENABLE ROW LEVEL SECURITY; ALTER TABLE uro_renal_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS uro_renal_records_t ON uro_renal_records; CREATE POLICY uro_renal_records_t ON uro_renal_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS uro_onco_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE uro_onco_records ENABLE ROW LEVEL SECURITY; ALTER TABLE uro_onco_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS uro_onco_records_t ON uro_onco_records; CREATE POLICY uro_onco_records_t ON uro_onco_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS uro_peds_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE uro_peds_records ENABLE ROW LEVEL SECURITY; ALTER TABLE uro_peds_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS uro_peds_records_t ON uro_peds_records; CREATE POLICY uro_peds_records_t ON uro_peds_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS uro_andrology_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE uro_andrology_records ENABLE ROW LEVEL SECURITY; ALTER TABLE uro_andrology_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS uro_andrology_records_t ON uro_andrology_records; CREATE POLICY uro_andrology_records_t ON uro_andrology_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
