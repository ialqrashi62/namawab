-- filepath: migrations/e999-g069_nursing_ext.sql
-- TIER49 Nursing Extended (5 tables)
CREATE TABLE IF NOT EXISTS nurs_assess (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  assessment TEXT,
  temp NUMERIC,
  heart_rate NUMERIC,
  resp_rate NUMERIC,
  bp_systolic NUMERIC,
  gcs INT,
  pain_score INT,
  risk_score INT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE nurs_assess ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurs_assess FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON nurs_assess;
CREATE POLICY p1 ON nurs_assess USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS nurs_med (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  drug TEXT,
  route TEXT,
  dose TEXT,
  site TEXT,
  verification TEXT,
  reaction TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE nurs_med ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurs_med FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON nurs_med;
CREATE POLICY p1 ON nurs_med USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS nurs_wound (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  wound_type TEXT,
  site TEXT,
  stage TEXT,
  size_cm TEXT,
  exudate TEXT,
  frequency TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE nurs_wound ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurs_wound FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON nurs_wound;
CREATE POLICY p1 ON nurs_wound USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS nurs_resp (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  device TEXT,
  flow NUMERIC,
  cpap NUMERIC,
  oxygen_sat NUMERIC,
  alarm_type TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE nurs_resp ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurs_resp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON nurs_resp;
CREATE POLICY p1 ON nurs_resp USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS nurs_safety (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  safety_event TEXT,
  type TEXT,
  compliance TEXT,
  identifier TEXT,
  alerts TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE nurs_safety ENABLE ROW LEVEL SECURITY;
ALTER TABLE nurs_safety FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON nurs_safety;
CREATE POLICY p1 ON nurs_safety USING (tenant_id = current_setting('app.tenant_id', true));