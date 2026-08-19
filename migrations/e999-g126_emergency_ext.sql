-- migrations/e999-g126_emergency_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS er_ext_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE er_ext_records ENABLE ROW LEVEL SECURITY; ALTER TABLE er_ext_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS er_ext_records_t ON er_ext_records; CREATE POLICY er_ext_records_t ON er_ext_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS trauma_center_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE trauma_center_records ENABLE ROW LEVEL SECURITY; ALTER TABLE trauma_center_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS trauma_center_records_t ON trauma_center_records; CREATE POLICY trauma_center_records_t ON trauma_center_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS disaster_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE disaster_records ENABLE ROW LEVEL SECURITY; ALTER TABLE disaster_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS disaster_records_t ON disaster_records; CREATE POLICY disaster_records_t ON disaster_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS poison_control_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE poison_control_records ENABLE ROW LEVEL SECURITY; ALTER TABLE poison_control_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS poison_control_records_t ON poison_control_records; CREATE POLICY poison_control_records_t ON poison_control_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS pre_hospital_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pre_hospital_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pre_hospital_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pre_hospital_records_t ON pre_hospital_records; CREATE POLICY pre_hospital_records_t ON pre_hospital_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);