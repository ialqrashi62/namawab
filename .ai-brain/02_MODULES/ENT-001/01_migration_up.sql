-- e111_ent_module_up.sql
BEGIN;
CREATE TABLE ent_encounters (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id BIGINT NOT NULL, encounter_id BIGINT, encounter_type VARCHAR(30), started_at TIMESTAMPTZ NOT NULL, primary_diagnosis TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX idx_ent_enc_tenant ON ent_encounters(tenant_id, started_at);
ALTER TABLE ent_encounters ENABLE ROW LEVEL SECURITY; ALTER TABLE ent_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY ent_enc_tenant ON ent_encounters USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE ent_audiology (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id BIGINT NOT NULL, test_date TIMESTAMPTZ, ear VARCHAR(10), frequency_hz INT, threshold_db INT, type VARCHAR(30));
ALTER TABLE ent_audiology ENABLE ROW LEVEL SECURITY; ALTER TABLE ent_audiology FORCE ROW LEVEL SECURITY;
CREATE POLICY ent_audio_tenant ON ent_audiology USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE ent_procedures (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, encounter_id BIGINT NOT NULL REFERENCES ent_encounters(id) ON DELETE CASCADE, procedure_name VARCHAR(100), cpt_code VARCHAR(20), laterality VARCHAR(10), complications TEXT);
ALTER TABLE ent_procedures ENABLE ROW LEVEL SECURITY; ALTER TABLE ent_procedures FORCE ROW LEVEL SECURITY;
CREATE POLICY ent_proc_tenant ON ent_procedures USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE ent_vector_index (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, module_id VARCHAR(20) DEFAULT 'ENT-001', embedding VECTOR(768));
CREATE INDEX idx_ent_vector_hnsw ON ent_vector_index USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);
ALTER TABLE ent_vector_index ENABLE ROW LEVEL SECURITY; ALTER TABLE ent_vector_index FORCE ROW LEVEL SECURITY;
CREATE POLICY ent_vector_tenant ON ent_vector_index USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
COMMIT;
