-- e114_ophth_module_up.sql
BEGIN;
CREATE TABLE ophth_encounters (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id BIGINT NOT NULL, encounter_id BIGINT, encounter_type VARCHAR(30), started_at TIMESTAMPTZ NOT NULL, primary_diagnosis TEXT, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE INDEX idx_ophth_enc_tenant ON ophth_encounters(tenant_id, started_at);
ALTER TABLE ophth_encounters ENABLE ROW LEVEL SECURITY; ALTER TABLE ophth_encounters FORCE ROW LEVEL SECURITY;
CREATE POLICY ophth_enc_tenant ON ophth_encounters USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE ophth_exam (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id BIGINT NOT NULL, encounter_id BIGINT REFERENCES ophth_encounters(id), eye VARCHAR(10), va_distance VARCHAR(20), va_near VARCHAR(20), iop_mmhg NUMERIC(4,1), refraction JSONB, slit_lamp TEXT, fundus TEXT);
ALTER TABLE ophth_exam ENABLE ROW LEVEL SECURITY; ALTER TABLE ophth_exam FORCE ROW LEVEL SECURITY;
CREATE POLICY ophth_exam_tenant ON ophth_exam USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
CREATE TABLE ophth_vector_index (id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, module_id VARCHAR(20) DEFAULT 'OPHTH-001', embedding VECTOR(768));
CREATE INDEX idx_ophth_vector_hnsw ON ophth_vector_index USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);
ALTER TABLE ophth_vector_index ENABLE ROW LEVEL SECURITY; ALTER TABLE ophth_vector_index FORCE ROW LEVEL SECURITY;
CREATE POLICY ophth_vector_tenant ON ophth_vector_index USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
COMMIT;
