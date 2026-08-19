-- migrations/e999-g102_obgyn_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS obgyn_antenatal_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE obgyn_antenatal_records ENABLE ROW LEVEL SECURITY; ALTER TABLE obgyn_antenatal_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_antenatal_records_t ON obgyn_antenatal_records; CREATE POLICY obgyn_antenatal_records_t ON obgyn_antenatal_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS obgyn_gyne_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE obgyn_gyne_records ENABLE ROW LEVEL SECURITY; ALTER TABLE obgyn_gyne_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_gyne_records_t ON obgyn_gyne_records; CREATE POLICY obgyn_gyne_records_t ON obgyn_gyne_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS obgyn_onc_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE obgyn_onc_records ENABLE ROW LEVEL SECURITY; ALTER TABLE obgyn_onc_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_onc_records_t ON obgyn_onc_records; CREATE POLICY obgyn_onc_records_t ON obgyn_onc_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS obgyn_labor_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE obgyn_labor_records ENABLE ROW LEVEL SECURITY; ALTER TABLE obgyn_labor_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_labor_records_t ON obgyn_labor_records; CREATE POLICY obgyn_labor_records_t ON obgyn_labor_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS obgyn_repro_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE obgyn_repro_records ENABLE ROW LEVEL SECURITY; ALTER TABLE obgyn_repro_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_repro_records_t ON obgyn_repro_records; CREATE POLICY obgyn_repro_records_t ON obgyn_repro_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
