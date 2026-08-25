-- migrations/e999-g100_ent_ext.sql
SET search_path = public;

CREATE TABLE IF NOT EXISTS ent_general_records (
  id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ent_general_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_general_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ent_general_records_t ON ent_general_records;
CREATE POLICY ent_general_records_t ON ent_general_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ent_sinus_records (
  id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ent_sinus_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_sinus_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ent_sinus_records_t ON ent_sinus_records;
CREATE POLICY ent_sinus_records_t ON ent_sinus_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ent_throat_records (
  id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ent_throat_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_throat_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ent_throat_records_t ON ent_throat_records;
CREATE POLICY ent_throat_records_t ON ent_throat_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ent_head_neck_records (
  id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ent_head_neck_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_head_neck_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ent_head_neck_records_t ON ent_head_neck_records;
CREATE POLICY ent_head_neck_records_t ON ent_head_neck_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS ent_pediatric_records (
  id BIGSERIAL PRIMARY KEY, tenant_id UUID NOT NULL, patient_id TEXT, reference_id TEXT, payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE ent_pediatric_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ent_pediatric_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ent_pediatric_records_t ON ent_pediatric_records;
CREATE POLICY ent_pediatric_records_t ON ent_pediatric_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
