-- migrations/e999-g116_endocrinology_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS diabetes_t1dm_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE diabetes_t1dm_records ENABLE ROW LEVEL SECURITY; ALTER TABLE diabetes_t1dm_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS diabetes_t1dm_records_t ON diabetes_t1dm_records; CREATE POLICY diabetes_t1dm_records_t ON diabetes_t1dm_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS diabetes_t2dm_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE diabetes_t2dm_records ENABLE ROW LEVEL SECURITY; ALTER TABLE diabetes_t2dm_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS diabetes_t2dm_records_t ON diabetes_t2dm_records; CREATE POLICY diabetes_t2dm_records_t ON diabetes_t2dm_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS thyroid_extended_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE thyroid_extended_records ENABLE ROW LEVEL SECURITY; ALTER TABLE thyroid_extended_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS thyroid_extended_records_t ON thyroid_extended_records; CREATE POLICY thyroid_extended_records_t ON thyroid_extended_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS adrenal_pituitary_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE adrenal_pituitary_records ENABLE ROW LEVEL SECURITY; ALTER TABLE adrenal_pituitary_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adrenal_pituitary_records_t ON adrenal_pituitary_records; CREATE POLICY adrenal_pituitary_records_t ON adrenal_pituitary_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS bone_metabolic_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE bone_metabolic_records ENABLE ROW LEVEL SECURITY; ALTER TABLE bone_metabolic_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bone_metabolic_records_t ON bone_metabolic_records; CREATE POLICY bone_metabolic_records_t ON bone_metabolic_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
