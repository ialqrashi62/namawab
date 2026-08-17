-- filepath: migrations/f008_dialysis_up.sql
-- TIER23_DIALYSIS_EXT 148-152 dialysis tables

CREATE TABLE IF NOT EXISTS tier23_dialysis_access (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  access_id TEXT,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier23_dialysis_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier23_dialysis_access FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier23_dialysis_access_tenant ON tier23_dialysis_access;
CREATE POLICY tier23_dialysis_access_tenant ON tier23_dialysis_access USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier23_dialysis_access_tenant_idx ON tier23_dialysis_access (tenant_id, access_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier23_dialysis_adequacy (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  session_id TEXT,
  patient_id TEXT,
  ktv DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier23_dialysis_adequacy ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier23_dialysis_adequacy FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier23_dialysis_adequacy_tenant ON tier23_dialysis_adequacy;
CREATE POLICY tier23_dialysis_adequacy_tenant ON tier23_dialysis_adequacy USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier23_dialysis_adequacy_tenant_idx ON tier23_dialysis_adequacy (tenant_id, session_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier23_dialysis_complication (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  episode_id TEXT,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier23_dialysis_complication ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier23_dialysis_complication FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier23_dialysis_complication_tenant ON tier23_dialysis_complication;
CREATE POLICY tier23_dialysis_complication_tenant ON tier23_dialysis_complication USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier23_dialysis_complication_tenant_idx ON tier23_dialysis_complication (tenant_id, episode_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier23_dialysis_peritoneal (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  episode_id TEXT,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier23_dialysis_peritoneal ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier23_dialysis_peritoneal FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier23_dialysis_peritoneal_tenant ON tier23_dialysis_peritoneal;
CREATE POLICY tier23_dialysis_peritoneal_tenant ON tier23_dialysis_peritoneal USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier23_dialysis_peritoneal_tenant_idx ON tier23_dialysis_peritoneal (tenant_id, episode_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier23_dialysis_dialyzer (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  session_id TEXT,
  patient_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier23_dialysis_dialyzer ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier23_dialysis_dialyzer FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier23_dialysis_dialyzer_tenant ON tier23_dialysis_dialyzer;
CREATE POLICY tier23_dialysis_dialyzer_tenant ON tier23_dialysis_dialyzer USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier23_dialysis_dialyzer_tenant_idx ON tier23_dialysis_dialyzer (tenant_id, session_id, created_at DESC);