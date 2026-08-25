-- filepath: migrations/f011_oncology_up.sql
-- TIER26_ONCOLOGY_EXT 163-167 oncology tables

CREATE TABLE IF NOT EXISTS tier26_oncology_tumor (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  case_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier26_oncology_tumor ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier26_oncology_tumor FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier26_oncology_tumor_tenant ON tier26_oncology_tumor;
CREATE POLICY tier26_oncology_tumor_tenant ON tier26_oncology_tumor USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier26_oncology_tumor_tenant_idx ON tier26_oncology_tumor (tenant_id, case_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier26_oncology_chemo (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier26_oncology_chemo ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier26_oncology_chemo FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier26_oncology_chemo_tenant ON tier26_oncology_chemo;
CREATE POLICY tier26_oncology_chemo_tenant ON tier26_oncology_chemo USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier26_oncology_chemo_tenant_idx ON tier26_oncology_chemo (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier26_oncology_radiation (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  plan_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier26_oncology_radiation ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier26_oncology_radiation FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier26_oncology_radiation_tenant ON tier26_oncology_radiation;
CREATE POLICY tier26_oncology_radiation_tenant ON tier26_oncology_radiation USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier26_oncology_radiation_tenant_idx ON tier26_oncology_radiation (tenant_id, plan_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier26_oncology_palliative (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier26_oncology_palliative ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier26_oncology_palliative FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier26_oncology_palliative_tenant ON tier26_oncology_palliative;
CREATE POLICY tier26_oncology_palliative_tenant ON tier26_oncology_palliative USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier26_oncology_palliative_tenant_idx ON tier26_oncology_palliative (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier26_oncology_survivor (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier26_oncology_survivor ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier26_oncology_survivor FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier26_oncology_survivor_tenant ON tier26_oncology_survivor;
CREATE POLICY tier26_oncology_survivor_tenant ON tier26_oncology_survivor USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier26_oncology_survivor_tenant_idx ON tier26_oncology_survivor (tenant_id, patient_id, created_at DESC);