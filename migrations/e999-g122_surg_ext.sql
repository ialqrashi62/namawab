-- migrations/e999-g122_surg_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS surg_general_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE surg_general_records ENABLE ROW LEVEL SECURITY; ALTER TABLE surg_general_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS surg_general_records_t ON surg_general_records; CREATE POLICY surg_general_records_t ON surg_general_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS surg_oncology_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE surg_oncology_records ENABLE ROW LEVEL SECURITY; ALTER TABLE surg_oncology_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS surg_oncology_records_t ON surg_oncology_records; CREATE POLICY surg_oncology_records_t ON surg_oncology_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS surg_vascular_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE surg_vascular_records ENABLE ROW LEVEL SECURITY; ALTER TABLE surg_vascular_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS surg_vascular_records_t ON surg_vascular_records; CREATE POLICY surg_vascular_records_t ON surg_vascular_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS surg_trauma_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE surg_trauma_records ENABLE ROW LEVEL SECURITY; ALTER TABLE surg_trauma_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS surg_trauma_records_t ON surg_trauma_records; CREATE POLICY surg_trauma_records_t ON surg_trauma_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS surg_transplant_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE surg_transplant_records ENABLE ROW LEVEL SECURITY; ALTER TABLE surg_transplant_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS surg_transplant_records_t ON surg_transplant_records; CREATE POLICY surg_transplant_records_t ON surg_transplant_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
