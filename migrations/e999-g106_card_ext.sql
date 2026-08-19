-- migrations/e999-g106_card_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS card_heart_failure_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE card_heart_failure_records ENABLE ROW LEVEL SECURITY; ALTER TABLE card_heart_failure_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS card_heart_failure_records_t ON card_heart_failure_records; CREATE POLICY card_heart_failure_records_t ON card_heart_failure_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS card_intervention_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE card_intervention_records ENABLE ROW LEVEL SECURITY; ALTER TABLE card_intervention_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS card_intervention_records_t ON card_intervention_records; CREATE POLICY card_intervention_records_t ON card_intervention_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS card_imaging_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE card_imaging_records ENABLE ROW LEVEL SECURITY; ALTER TABLE card_imaging_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS card_imaging_records_t ON card_imaging_records; CREATE POLICY card_imaging_records_t ON card_imaging_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS card_rehab_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE card_rehab_records ENABLE ROW LEVEL SECURITY; ALTER TABLE card_rehab_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS card_rehab_records_t ON card_rehab_records; CREATE POLICY card_rehab_records_t ON card_rehab_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS card_arrhythmia_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE card_arrhythmia_records ENABLE ROW LEVEL SECURITY; ALTER TABLE card_arrhythmia_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS card_arrhythmia_records_t ON card_arrhythmia_records; CREATE POLICY card_arrhythmia_records_t ON card_arrhythmia_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
