-- e513 TIER4_SLEEP-101 Assessment
CREATE TABLE IF NOT EXISTS tier4_sleep_101_psqi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  subjective_quality NUMERIC NOT NULL,
  sleep_latency NUMERIC NOT NULL,
  sleep_duration NUMERIC NOT NULL,
  sleep_efficiency NUMERIC NOT NULL,
  sleep_disturbances NUMERIC NOT NULL,
  use_sleep_meds NUMERIC NOT NULL,
  daytime_dysfunction NUMERIC NOT NULL,
  total NUMERIC,
  quality TEXT,
  citations TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_101_psqi ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_101_psqi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_101_psqi_t ON tier4_sleep_101_psqi;
CREATE POLICY tier4_sleep_101_psqi_t ON tier4_sleep_101_psqi
  USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS tier4_sleep_101_ess (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT NOT NULL,
  sitting_reading NUMERIC NOT NULL,
  watching_tv NUMERIC NOT NULL,
  sitting_inactive NUMERIC NOT NULL,
  passenger NUMERIC NOT NULL,
  lying_afternoon NUMERIC NOT NULL,
  sitting_talking NUMERIC NOT NULL,
  lunch NUMERIC NOT NULL,
  driving NUMERIC NOT NULL,
  total NUMERIC,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE tier4_sleep_101_ess ENABLE ROW LEVEL SECURITY;
ALTER TABLE tier4_sleep_101_ess FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tier4_sleep_101_ess_t ON tier4_sleep_101_ess;
CREATE POLICY tier4_sleep_101_ess_t ON tier4_sleep_101_ess
  USING (tenant_id = current_setting('app.tenant_id', true));