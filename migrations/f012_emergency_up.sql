-- filepath: migrations/f012_emergency_up.sql
-- TIER27_EMERGENCY_EXT 168-172 emergency tables

CREATE TABLE IF NOT EXISTS tier27_emergency_triage (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  encounter_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier27_emergency_triage ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier27_emergency_triage FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier27_emergency_triage_tenant ON tier27_emergency_triage;
CREATE POLICY tier27_emergency_triage_tenant ON tier27_emergency_triage USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier27_emergency_triage_tenant_idx ON tier27_emergency_triage (tenant_id, encounter_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier27_emergency_resus (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  episode_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier27_emergency_resus ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier27_emergency_resus FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier27_emergency_resus_tenant ON tier27_emergency_resus;
CREATE POLICY tier27_emergency_resus_tenant ON tier27_emergency_resus USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier27_emergency_resus_tenant_idx ON tier27_emergency_resus (tenant_id, episode_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier27_emergency_trauma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  activation_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier27_emergency_trauma ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier27_emergency_trauma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier27_emergency_trauma_tenant ON tier27_emergency_trauma;
CREATE POLICY tier27_emergency_trauma_tenant ON tier27_emergency_trauma USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier27_emergency_trauma_tenant_idx ON tier27_emergency_trauma (tenant_id, activation_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier27_emergency_tox (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  assessment_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier27_emergency_tox ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier27_emergency_tox FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier27_emergency_tox_tenant ON tier27_emergency_tox;
CREATE POLICY tier27_emergency_tox_tenant ON tier27_emergency_tox USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier27_emergency_tox_tenant_idx ON tier27_emergency_tox (tenant_id, assessment_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier27_emergency_ems (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  dispatch_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier27_emergency_ems ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier27_emergency_ems FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier27_emergency_ems_tenant ON tier27_emergency_ems;
CREATE POLICY tier27_emergency_ems_tenant ON tier27_emergency_ems USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier27_emergency_ems_tenant_idx ON tier27_emergency_ems (tenant_id, dispatch_id, created_at DESC);