-- migrations/e999-g131_proc_diag_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS cardiac_cath_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE cardiac_cath_records ENABLE ROW LEVEL SECURITY; ALTER TABLE cardiac_cath_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardiac_cath_records_t ON cardiac_cath_records; CREATE POLICY cardiac_cath_records_t ON cardiac_cath_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS cardiac_rehab_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE cardiac_rehab_records ENABLE ROW LEVEL SECURITY; ALTER TABLE cardiac_rehab_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardiac_rehab_records_t ON cardiac_rehab_records; CREATE POLICY cardiac_rehab_records_t ON cardiac_rehab_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS electrophysiology_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE electrophysiology_records ENABLE ROW LEVEL SECURITY; ALTER TABLE electrophysiology_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS electrophysiology_records_t ON electrophysiology_records; CREATE POLICY electrophysiology_records_t ON electrophysiology_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS dialysis_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE dialysis_records ENABLE ROW LEVEL SECURITY; ALTER TABLE dialysis_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dialysis_records_t ON dialysis_records; CREATE POLICY dialysis_records_t ON dialysis_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS neuro_diag_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE neuro_diag_records ENABLE ROW LEVEL SECURITY; ALTER TABLE neuro_diag_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_diag_records_t ON neuro_diag_records; CREATE POLICY neuro_diag_records_t ON neuro_diag_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);