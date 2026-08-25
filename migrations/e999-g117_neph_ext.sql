-- migrations/e999-g117_neph_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS neph_acute_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neph_acute_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neph_acute_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neph_acute_records_t ON neph_acute_records; CREATE POLICY neph_acute_records_t ON neph_acute_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS neph_glomerular_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neph_glomerular_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neph_glomerular_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neph_glomerular_records_t ON neph_glomerular_records; CREATE POLICY neph_glomerular_records_t ON neph_glomerular_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS neph_vascular_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neph_vascular_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neph_vascular_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neph_vascular_records_t ON neph_vascular_records; CREATE POLICY neph_vascular_records_t ON neph_vascular_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS neph_dialysis_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neph_dialysis_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neph_dialysis_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neph_dialysis_records_t ON neph_dialysis_records; CREATE POLICY neph_dialysis_records_t ON neph_dialysis_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS neph_imaging_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neph_imaging_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neph_imaging_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neph_imaging_records_t ON neph_imaging_records; CREATE POLICY neph_imaging_records_t ON neph_imaging_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
