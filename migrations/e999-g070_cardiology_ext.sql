-- filepath: migrations/e999-g070_cardiology_ext.sql
-- TIER50 Cardiology Extended 2 (5 tables)
CREATE TABLE IF NOT EXISTS card_failure (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  type TEXT,
  ef_percent NUMERIC,
  nyha_class INT,
  bnp NUMERIC,
  therapy TEXT,
  prognosis TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE card_failure ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_failure FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON card_failure;
CREATE POLICY p1 ON card_failure USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS card_arr (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  type TEXT,
  rhythm TEXT,
  rate NUMERIC,
  chads_vasc INT,
  anticoagulation TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE card_arr ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_arr FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON card_arr;
CREATE POLICY p1 ON card_arr USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS card_valve (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  valve TEXT,
  severity TEXT,
  intervention TEXT,
  mean_gradient_mmhg NUMERIC,
  valve_area_cm2 NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE card_valve ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_valve FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON card_valve;
CREATE POLICY p1 ON card_valve USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS card_ischemic (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  syndrome TEXT,
  culprit_artery TEXT,
  troponin_peak NUMERIC,
  grace_score INT,
  strategy TEXT,
  outcome TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE card_ischemic ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_ischemic FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON card_ischemic;
CREATE POLICY p1 ON card_ischemic USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS card_cong (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  lesion TEXT,
  type TEXT,
  size_mm NUMERIC,
  closure TEXT,
  complications TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE card_cong ENABLE ROW LEVEL SECURITY;
ALTER TABLE card_cong FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON card_cong;
CREATE POLICY p1 ON card_cong USING (tenant_id = current_setting('app.tenant_id', true));