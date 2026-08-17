-- filepath: migrations/f007_wound_up.sql
-- TIER22_WOUND_EXT 143-147 wound care tables

CREATE TABLE IF NOT EXISTS tier22_wound_assessment (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  wound_id TEXT,
  patient_id TEXT,
  etiology TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier22_wound_assessment ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier22_wound_assessment FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier22_wound_assessment_tenant ON tier22_wound_assessment;
CREATE POLICY tier22_wound_assessment_tenant ON tier22_wound_assessment USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier22_wound_assessment_tenant_idx ON tier22_wound_assessment (tenant_id, wound_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier22_wound_dressing (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  wound_id TEXT,
  dressing_type TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier22_wound_dressing ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier22_wound_dressing FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier22_wound_dressing_tenant ON tier22_wound_dressing;
CREATE POLICY tier22_wound_dressing_tenant ON tier22_wound_dressing USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier22_wound_dressing_tenant_idx ON tier22_wound_dressing (tenant_id, wound_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier22_wound_healing (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  wound_id TEXT,
  trajectory_status TEXT,
  healing_pct DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier22_wound_healing ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier22_wound_healing FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier22_wound_healing_tenant ON tier22_wound_healing;
CREATE POLICY tier22_wound_healing_tenant ON tier22_wound_healing USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier22_wound_healing_tenant_idx ON tier22_wound_healing (tenant_id, wound_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier22_wound_measurement (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  wound_id TEXT,
  measurement_id TEXT,
  area_cm2 DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier22_wound_measurement ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier22_wound_measurement FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier22_wound_measurement_tenant ON tier22_wound_measurement;
CREATE POLICY tier22_wound_measurement_tenant ON tier22_wound_measurement USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier22_wound_measurement_tenant_idx ON tier22_wound_measurement (tenant_id, wound_id, created_at DESC);

CREATE TABLE IF NOT EXISTS tier22_wound_staging (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  wound_id TEXT,
  stage TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier22_wound_staging ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier22_wound_staging FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier22_wound_staging_tenant ON tier22_wound_staging;
CREATE POLICY tier22_wound_staging_tenant ON tier22_wound_staging USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier22_wound_staging_tenant_idx ON tier22_wound_staging (tenant_id, wound_id, created_at DESC);