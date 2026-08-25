-- migrations/e999-g103_derm_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS derm_general_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE derm_general_records ENABLE ROW LEVEL SECURITY; ALTER TABLE derm_general_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS derm_general_records_t ON derm_general_records; CREATE POLICY derm_general_records_t ON derm_general_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS derm_onc_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE derm_onc_records ENABLE ROW LEVEL SECURITY; ALTER TABLE derm_onc_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS derm_onc_records_t ON derm_onc_records; CREATE POLICY derm_onc_records_t ON derm_onc_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS derm_immuno_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE derm_immuno_records ENABLE ROW LEVEL SECURITY; ALTER TABLE derm_immuno_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS derm_immuno_records_t ON derm_immuno_records; CREATE POLICY derm_immuno_records_t ON derm_immuno_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS derm_cosmetic_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE derm_cosmetic_records ENABLE ROW LEVEL SECURITY; ALTER TABLE derm_cosmetic_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS derm_cosmetic_records_t ON derm_cosmetic_records; CREATE POLICY derm_cosmetic_records_t ON derm_cosmetic_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS derm_peds_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE derm_peds_records ENABLE ROW LEVEL SECURITY; ALTER TABLE derm_peds_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS derm_peds_records_t ON derm_peds_records; CREATE POLICY derm_peds_records_t ON derm_peds_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
