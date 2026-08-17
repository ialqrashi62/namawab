-- filepath: migrations/e999-g074_emergency_ext.sql
-- TIER54 Emergency Extended 2 (5 tables)
CREATE TABLE IF NOT EXISTS er_trauma (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  mechanism TEXT,
  iss NUMERIC,
  tbsa_pct NUMERIC,
  airway TEXT,
  intervention TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE er_trauma ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_trauma FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON er_trauma;
CREATE POLICY p1 ON er_trauma USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS er_cardio (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  presentation TEXT,
  rhythm TEXT,
  type TEXT,
  nihss INT,
  intervention TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE er_cardio ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_cardio FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON er_cardio;
CREATE POLICY p1 ON er_cardio USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS er_neuro (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  condition TEXT,
  nihss INT,
  gcs INT,
  ph NUMERIC,
  intervention TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE er_neuro ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_neuro FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON er_neuro;
CREATE POLICY p1 ON er_neuro USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS er_resp (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  type TEXT,
  ph NUMERIC,
  oxygen_sat NUMERIC,
  intervention TEXT,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE er_resp ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_resp FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON er_resp;
CREATE POLICY p1 ON er_resp USING (tenant_id = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS er_gi_gi (
  id BIGSERIAL PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  patient_id TEXT,
  source TEXT,
  site TEXT,
  etiology TEXT,
  hgb NUMERIC,
  intervention TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE er_gi_gi ENABLE ROW LEVEL SECURITY;
ALTER TABLE er_gi_gi FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS p1 ON er_gi_gi;
CREATE POLICY p1 ON er_gi_gi USING (tenant_id = current_setting('app.tenant_id', true));