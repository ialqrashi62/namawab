-- migrations/e999-g130_pharmacy_ext.sql
SET search_path = public;
CREATE TABLE IF NOT EXISTS pharmacy_clinical_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE pharmacy_clinical_records ENABLE ROW LEVEL SECURITY; ALTER TABLE pharmacy_clinical_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS pharmacy_clinical_records_t ON pharmacy_clinical_records; CREATE POLICY pharmacy_clinical_records_t ON pharmacy_clinical_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS antimicrobial_stewardship_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE antimicrobial_stewardship_records ENABLE ROW LEVEL SECURITY; ALTER TABLE antimicrobial_stewardship_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS antimicrobial_stewardship_records_t ON antimicrobial_stewardship_records; CREATE POLICY antimicrobial_stewardship_records_t ON antimicrobial_stewardship_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS chemotherapy_pharmacy_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE chemotherapy_pharmacy_records ENABLE ROW LEVEL SECURITY; ALTER TABLE chemotherapy_pharmacy_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS chemotherapy_pharmacy_records_t ON chemotherapy_pharmacy_records; CREATE POLICY chemotherapy_pharmacy_records_t ON chemotherapy_pharmacy_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS adverse_drug_reaction_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE adverse_drug_reaction_records ENABLE ROW LEVEL SECURITY; ALTER TABLE adverse_drug_reaction_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adverse_drug_reaction_records_t ON adverse_drug_reaction_records; CREATE POLICY adverse_drug_reaction_records_t ON adverse_drug_reaction_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE IF NOT EXISTS medication_safety_records (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
ALTER TABLE medication_safety_records ENABLE ROW LEVEL SECURITY; ALTER TABLE medication_safety_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS medication_safety_records_t ON medication_safety_records; CREATE POLICY medication_safety_records_t ON medication_safety_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);