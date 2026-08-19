-- migrations/e999-g099_ophth_ext.sql
SET search_path = public;

CREATE TABLE IF NOT EXISTS ophth_general_records (
  id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ophth_general_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ophth_general_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ophth_general_records_t ON ophth_general_records;
CREATE POLICY ophth_general_records_t ON ophth_general_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ophth_retina_records (
  id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ophth_retina_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ophth_retina_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ophth_retina_records_t ON ophth_retina_records;
CREATE POLICY ophth_retina_records_t ON ophth_retina_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ophth_cataract_records (
  id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ophth_cataract_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ophth_cataract_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ophth_cataract_records_t ON ophth_cataract_records;
CREATE POLICY ophth_cataract_records_t ON ophth_cataract_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ophth_glaucoma_records (
  id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ophth_glaucoma_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ophth_glaucoma_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ophth_glaucoma_records_t ON ophth_glaucoma_records;
CREATE POLICY ophth_glaucoma_records_t ON ophth_glaucoma_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ophth_pediatric_records (
  id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ophth_pediatric_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ophth_pediatric_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ophth_pediatric_records_t ON ophth_pediatric_records;
CREATE POLICY ophth_pediatric_records_t ON ophth_pediatric_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
