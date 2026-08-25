-- migrations/e999-g111_geriatric_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS geriatric_assessment_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE geriatric_assessment_records ENABLE ROW LEVEL SECURITY; ALTER TABLE geriatric_assessment_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS geriatric_assessment_records_t ON geriatric_assessment_records; CREATE POLICY geriatric_assessment_records_t ON geriatric_assessment_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS geriatric_falls_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE geriatric_falls_records ENABLE ROW LEVEL SECURITY; ALTER TABLE geriatric_falls_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS geriatric_falls_records_t ON geriatric_falls_records; CREATE POLICY geriatric_falls_records_t ON geriatric_falls_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS geriatric_polypharmacy_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE geriatric_polypharmacy_records ENABLE ROW LEVEL SECURITY; ALTER TABLE geriatric_polypharmacy_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS geriatric_polypharmacy_records_t ON geriatric_polypharmacy_records; CREATE POLICY geriatric_polypharmacy_records_t ON geriatric_polypharmacy_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS geriatric_dementia_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE geriatric_dementia_records ENABLE ROW LEVEL SECURITY; ALTER TABLE geriatric_dementia_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS geriatric_dementia_records_t ON geriatric_dementia_records; CREATE POLICY geriatric_dementia_records_t ON geriatric_dementia_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS geriatric_palliative_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE geriatric_palliative_records ENABLE ROW LEVEL SECURITY; ALTER TABLE geriatric_palliative_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS geriatric_palliative_records_t ON geriatric_palliative_records; CREATE POLICY geriatric_palliative_records_t ON geriatric_palliative_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
