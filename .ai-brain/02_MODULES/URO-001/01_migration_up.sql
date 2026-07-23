-- e112_uro_module_up.sql
BEGIN;
CREATE TABLE uro_encounters (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id BIGINT NOT NULL, encounter_id BIGINT, encounter_type VARCHAR(30), started_at TIMESTAMPTZ NOT NULL, primary_diagnosis TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX idx_uro_enc_tenant ON uro_encounters(tenant_id, started_at);
ALTER TABLE uro_encounters ENABLE ROW LEVEL SECURITY; ALTER TABLE uro_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY uro_enc_tenant ON uro_encounters USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE uro_stone (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, encounter_id BIGINT NOT NULL REFERENCES uro_encounters(id) ON DELETE CASCADE, stone_type VARCHAR(20), size_mm NUMERIC(5,2), location VARCHAR(50), laterality VARCHAR(10), intervention_type VARCHAR(50));
ALTER TABLE uro_stone ENABLE ROW LEVEL SECURITY; ALTER TABLE uro_stone FORCE ROW LEVEL SECURITY;
CREATE POLICY uro_stone_tenant ON uro_stone USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE uro_procedures (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, encounter_id BIGINT NOT NULL REFERENCES uro_encounters(id) ON DELETE CASCADE, procedure_name VARCHAR(100), cpt_code VARCHAR(20), complications TEXT);
ALTER TABLE uro_procedures ENABLE ROW LEVEL SECURITY; ALTER TABLE uro_procedures FORCE ROW LEVEL SECURITY;
CREATE POLICY uro_proc_tenant ON uro_procedures USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE uro_vector_index (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, module_id VARCHAR(20) DEFAULT 'URO-001', embedding VECTOR(768));
CREATE INDEX idx_uro_vector_hnsw ON uro_vector_index USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);
ALTER TABLE uro_vector_index ENABLE ROW LEVEL SECURITY; ALTER TABLE uro_vector_index FORCE ROW LEVEL SECURITY;
CREATE POLICY uro_vector_tenant ON uro_vector_index USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
COMMIT;
