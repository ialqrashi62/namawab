-- filepath: migrations/e992_pop_health_up.sql
-- TIER7_POP_HEALTH_EXT 101-106 population health tables

-- 101 disease registry
CREATE TABLE IF NOT EXISTS tier7_ph_registry (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  registry_type TEXT,
  enrolled_date TEXT,
  eligibility TEXT,
  consent BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier7_ph_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier7_ph_registry FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier7_ph_registry_tenant ON tier7_ph_registry;
CREATE POLICY tier7_ph_registry_tenant ON tier7_ph_registry USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier7_ph_registry_tenant_idx ON tier7_ph_registry (tenant_id, registry_type, created_at DESC);

-- 102 screening outcomes
CREATE TABLE IF NOT EXISTS tier7_ph_screening (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  patient_id TEXT,
  screening_type TEXT,
  recommendation TEXT,
  overdue_pct DOUBLE PRECISION,
  action TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier7_ph_screening ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier7_ph_screening FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier7_ph_screening_tenant ON tier7_ph_screening;
CREATE POLICY tier7_ph_screening_tenant ON tier7_ph_screening USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier7_ph_screening_tenant_idx ON tier7_ph_screening (tenant_id, screening_type, created_at DESC);

-- 103 cohort & risk
CREATE TABLE IF NOT EXISTS tier7_ph_cohort (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  cohort_id TEXT,
  cohort_name TEXT,
  patient_id TEXT,
  risk_score INTEGER,
  band TEXT,
  closure_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier7_ph_cohort ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier7_ph_cohort FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier7_ph_cohort_tenant ON tier7_ph_cohort;
CREATE POLICY tier7_ph_cohort_tenant ON tier7_ph_cohort USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier7_ph_cohort_tenant_idx ON tier7_ph_cohort (tenant_id, cohort_id, created_at DESC);

-- 104 HEDIS measures
CREATE TABLE IF NOT EXISTS tier7_ph_hedis (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  measure_id TEXT,
  measurement_year TEXT,
  measure_rate DOUBLE PRECISION,
  stars INTEGER,
  band TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier7_ph_hedis ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier7_ph_hedis FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier7_ph_hedis_tenant ON tier7_ph_hedis;
CREATE POLICY tier7_ph_hedis_tenant ON tier7_ph_hedis USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier7_ph_hedis_tenant_idx ON tier7_ph_hedis (tenant_id, measurement_year, created_at DESC);

-- 105 SDOH population dashboard
CREATE TABLE IF NOT EXISTS tier7_ph_sdoh_dash (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  population_id TEXT,
  any_need_pct DOUBLE PRECISION,
  connect_pct DOUBLE PRECISION,
  resolve_pct DOUBLE PRECISION,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier7_ph_sdoh_dash ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier7_ph_sdoh_dash FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier7_ph_sdoh_dash_tenant ON tier7_ph_sdoh_dash;
CREATE POLICY tier7_ph_sdoh_dash_tenant ON tier7_ph_sdoh_dash USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier7_ph_sdoh_dash_tenant_idx ON tier7_ph_sdoh_dash (tenant_id, population_id, created_at DESC);

-- 106 campaign outcomes
CREATE TABLE IF NOT EXISTS tier7_ph_campaign (
  id BIGSERIAL PRIMARY KEY,
  tenant_id UUID NOT NULL,
  campaign_id TEXT,
  campaign_name TEXT,
  campaign_type TEXT,
  effectiveness TEXT,
  convert_pct DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier7_ph_campaign ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier7_ph_campaign FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier7_ph_campaign_tenant ON tier7_ph_campaign;
CREATE POLICY tier7_ph_campaign_tenant ON tier7_ph_campaign USING (tenant_id::text = current_setting('app.tenant_id', true));
CREATE INDEX IF NOT EXISTS tier7_ph_campaign_tenant_idx ON tier7_ph_campaign (tenant_id, campaign_type, created_at DESC);