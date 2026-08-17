-- filepath: migrations/f010_rehab_up.sql
-- TIER25_REHAB_EXT 158-162 rehabilitation tables

CREATE TABLE IF NOT EXISTS tier25_rehab_function (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  assessment_id TEXT,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier25_rehab_function ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier25_rehab_function FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier25_rehab_function_tenant ON tier25_rehab_function;
CREATE POLICY tier25_rehab_function_tenant ON tier25_rehab_function USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier25_rehab_function_tenant_idx ON tier25_rehab_function (tenant_id, assessment_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier25_rehab_therapy (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier25_rehab_therapy ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier25_rehab_therapy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier25_rehab_therapy_tenant ON tier25_rehab_therapy;
CREATE POLICY tier25_rehab_therapy_tenant ON tier25_rehab_therapy USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier25_rehab_therapy_tenant_idx ON tier25_rehab_therapy (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier25_rehab_prosthetic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier25_rehab_prosthetic ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier25_rehab_prosthetic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier25_rehab_prosthetic_tenant ON tier25_rehab_prosthetic;
CREATE POLICY tier25_rehab_prosthetic_tenant ON tier25_rehab_prosthetic USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier25_rehab_prosthetic_tenant_idx ON tier25_rehab_prosthetic (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier25_rehab_neuro (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  assessment_id TEXT,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier25_rehab_neuro ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier25_rehab_neuro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier25_rehab_neuro_tenant ON tier25_rehab_neuro;
CREATE POLICY tier25_rehab_neuro_tenant ON tier25_rehab_neuro USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier25_rehab_neuro_tenant_idx ON tier25_rehab_neuro (tenant_id, assessment_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier25_rehab_pediatric (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier25_rehab_pediatric ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier25_rehab_pediatric FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier25_rehab_pediatric_tenant ON tier25_rehab_pediatric;
CREATE POLICY tier25_rehab_pediatric_tenant ON tier25_rehab_pediatric USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier25_rehab_pediatric_tenant_idx ON tier25_rehab_pediatric (tenant_id, patient_id, created_at DESC);