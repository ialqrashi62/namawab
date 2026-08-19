-- migrations/e999-g105_pain_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS pain_acute_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pain_acute_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pain_acute_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pain_acute_records_t ON pain_acute_records; CREATE POLICY pain_acute_records_t ON pain_acute_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS pain_chronic_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pain_chronic_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pain_chronic_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pain_chronic_records_t ON pain_chronic_records; CREATE POLICY pain_chronic_records_t ON pain_chronic_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS pain_procedures_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pain_procedures_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pain_procedures_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pain_procedures_records_t ON pain_procedures_records; CREATE POLICY pain_procedures_records_t ON pain_procedures_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS pain_rehab_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pain_rehab_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pain_rehab_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pain_rehab_records_t ON pain_rehab_records; CREATE POLICY pain_rehab_records_t ON pain_rehab_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS pain_specialty_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pain_specialty_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pain_specialty_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pain_specialty_records_t ON pain_specialty_records; CREATE POLICY pain_specialty_records_t ON pain_specialty_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
