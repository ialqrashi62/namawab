-- migrations/e999-g097_neuro_ext.sql
-- TIER77 Neurology Extended 5 FORCE_RLS tables
SET search_path = public;

CREATE TABLE IF NOT EXISTS neuro_stroke_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE neuro_stroke_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_stroke_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_stroke_records_t ON neuro_stroke_records;
CREATE POLICY neuro_stroke_records_t ON neuro_stroke_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS neuro_epilepsy_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE neuro_epilepsy_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_epilepsy_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_epilepsy_records_t ON neuro_epilepsy_records;
CREATE POLICY neuro_epilepsy_records_t ON neuro_epilepsy_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS neuro_movement_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE neuro_movement_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_movement_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_movement_records_t ON neuro_movement_records;
CREATE POLICY neuro_movement_records_t ON neuro_movement_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS neuro_neuromuscular_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE neuro_neuromuscular_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_neuromuscular_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_neuromuscular_records_t ON neuro_neuromuscular_records;
CREATE POLICY neuro_neuromuscular_records_t ON neuro_neuromuscular_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);

CREATE TABLE IF NOT EXISTS neuro_headache_records (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  reference_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE neuro_headache_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_headache_records FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_headache_records_t ON neuro_headache_records;
CREATE POLICY neuro_headache_records_t ON neuro_headache_records USING (tenant_id = current_setting('app.tenant_id', true)::uuid);
