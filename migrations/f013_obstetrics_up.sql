-- filepath: migrations/f013_obstetrics_up.sql
-- TIER28_OBSTETRICS_EXT 173-177 obstetrics tables

CREATE TABLE IF NOT EXISTS tier28_obstetrics_prenatal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier28_obstetrics_prenatal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier28_obstetrics_prenatal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier28_obstetrics_prenatal_tenant ON tier28_obstetrics_prenatal;
CREATE POLICY tier28_obstetrics_prenatal_tenant ON tier28_obstetrics_prenatal USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier28_obstetrics_prenatal_tenant_idx ON tier28_obstetrics_prenatal (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier28_obstetrics_labor (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  labor_id TEXT,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier28_obstetrics_labor ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier28_obstetrics_labor FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier28_obstetrics_labor_tenant ON tier28_obstetrics_labor;
CREATE POLICY tier28_obstetrics_labor_tenant ON tier28_obstetrics_labor USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier28_obstetrics_labor_tenant_idx ON tier28_obstetrics_labor (tenant_id, labor_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier28_obstetrics_gynecology (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier28_obstetrics_gynecology ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier28_obstetrics_gynecology FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier28_obstetrics_gynecology_tenant ON tier28_obstetrics_gynecology;
CREATE POLICY tier28_obstetrics_gynecology_tenant ON tier28_obstetrics_gynecology USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier28_obstetrics_gynecology_tenant_idx ON tier28_obstetrics_gynecology (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier28_obstetrics_neonatal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  newborn_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier28_obstetrics_neonatal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier28_obstetrics_neonatal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier28_obstetrics_neonatal_tenant ON tier28_obstetrics_neonatal;
CREATE POLICY tier28_obstetrics_neonatal_tenant ON tier28_obstetrics_neonatal USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier28_obstetrics_neonatal_tenant_idx ON tier28_obstetrics_neonatal (tenant_id, newborn_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier28_obstetrics_reproduction (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  couple_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier28_obstetrics_reproduction ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier28_obstetrics_reproduction FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier28_obstetrics_reproduction_tenant ON tier28_obstetrics_reproduction;
CREATE POLICY tier28_obstetrics_reproduction_tenant ON tier28_obstetrics_reproduction USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier28_obstetrics_reproduction_tenant_idx ON tier28_obstetrics_reproduction (tenant_id, couple_id, created_at DESC);