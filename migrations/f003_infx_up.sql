-- filepath: migrations/f003_infx_up.sql
-- TIER18_INFX_EXT 122-126 infection control tables

CREATE TABLE IF NOT EXISTS tier18_infx_outbreak (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  outbreak_id TEXT,
  organism TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier18_infx_outbreak ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier18_infx_outbreak FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier18_infx_outbreak_tenant ON tier18_infx_outbreak;
CREATE POLICY tier18_infx_outbreak_tenant ON tier18_infx_outbreak USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier18_infx_outbreak_tenant_idx ON tier18_infx_outbreak (tenant_id, outbreak_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier18_infx_isolation (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  pathogen TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier18_infx_isolation ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier18_infx_isolation FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier18_infx_isolation_tenant ON tier18_infx_isolation;
CREATE POLICY tier18_infx_isolation_tenant ON tier18_infx_isolation USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier18_infx_isolation_tenant_idx ON tier18_infx_isolation (tenant_id, patient_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier18_infx_mdro (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  mdro_type TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier18_infx_mdro ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier18_infx_mdro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier18_infx_mdro_tenant ON tier18_infx_mdro;
CREATE POLICY tier18_infx_mdro_tenant ON tier18_infx_mdro USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier18_infx_mdro_tenant_idx ON tier18_infx_mdro (tenant_id, mdro_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tier18_infx_surveillance (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  hai_type TEXT,
  sir DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier18_infx_surveillance ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier18_infx_surveillance FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier18_infx_surveillance_tenant ON tier18_infx_surveillance;
CREATE POLICY tier18_infx_surveillance_tenant ON tier18_infx_surveillance USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier18_infx_surveillance_tenant_idx ON tier18_infx_surveillance (tenant_id, hai_type, created_at DESC);

CREATE TABLE IF NOT EXISTS tier18_infx_employee (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  employee_id TEXT,
  vaccine_type TEXT,
  exposure_type TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier18_infx_employee ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier18_infx_employee FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier18_infx_employee_tenant ON tier18_infx_employee;
CREATE POLICY tier18_infx_employee_tenant ON tier18_infx_employee USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier18_infx_employee_tenant_idx ON tier18_infx_employee (tenant_id, employee_id, created_at DESC);