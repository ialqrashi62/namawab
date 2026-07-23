-- e113_endo_module_up.sql
BEGIN;
CREATE TABLE endo_encounters (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id BIGINT NOT NULL, encounter_id BIGINT, encounter_type VARCHAR(30), started_at TIMESTAMPTZ NOT NULL, primary_diagnosis TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX idx_endo_enc_tenant ON endo_encounters(tenant_id, started_at);
ALTER TABLE endo_encounters ENABLE ROW LEVEL SECURITY; ALTER TABLE endo_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY endo_enc_tenant ON endo_encounters USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE endo_diabetes (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id BIGINT NOT NULL, type VARCHAR(20), hba1c NUMERIC(4,2), fpg NUMERIC(5,1), current_meds TEXT, complications JSONB);
ALTER TABLE endo_diabetes ENABLE ROW LEVEL SECURITY; ALTER TABLE endo_diabetes FORCE ROW LEVEL SECURITY;
CREATE POLICY endo_diab_tenant ON endo_diabetes USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE endo_thyroid (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id BIGINT NOT NULL, tsh NUMERIC(6,3), free_t4 NUMERIC(5,2), free_t3 NUMERIC(5,2), antibodies JSONB, imaging TEXT);
ALTER TABLE endo_thyroid ENABLE ROW LEVEL SECURITY; ALTER TABLE endo_thyroid FORCE ROW LEVEL SECURITY;
CREATE POLICY endo_thy_tenant ON endo_thyroid USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE endo_vector_index (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, module_id VARCHAR(20) DEFAULT 'ENDO-001', embedding VECTOR(768));
CREATE INDEX idx_endo_vector_hnsw ON endo_vector_index USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);
ALTER TABLE endo_vector_index ENABLE ROW LEVEL SECURITY; ALTER TABLE endo_vector_index FORCE ROW LEVEL SECURITY;
CREATE POLICY endo_vector_tenant ON endo_vector_index USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
COMMIT;
