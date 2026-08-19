-- migrations/e999-g107_neph_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS neph_general_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neph_general_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neph_general_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neph_general_records_t ON neph_general_records; CREATE POLICY neph_general_records_t ON neph_general_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS neph_dialysis_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neph_dialysis_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neph_dialysis_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neph_dialysis_records_t ON neph_dialysis_records; CREATE POLICY neph_dialysis_records_t ON neph_dialysis_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS neph_nephrology_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neph_nephrology_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neph_nephrology_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neph_nephrology_records_t ON neph_nephrology_records; CREATE POLICY neph_nephrology_records_t ON neph_nephrology_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS neph_geri_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neph_geri_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neph_geri_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neph_geri_records_t ON neph_geri_records; CREATE POLICY neph_geri_records_t ON neph_geri_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS neph_advanced_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neph_advanced_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neph_advanced_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neph_advanced_records_t ON neph_advanced_records; CREATE POLICY neph_advanced_records_t ON neph_advanced_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
