-- e273 TIER3_ADM-109 Patient Safety / Adverse Events UP
CREATE TABLE IF NOT EXISTS adm_adverse_events (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  event_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  event_type VARCHAR(60),
  severity_level VARCHAR(30),
  sentinel_event VARCHAR(5),
  harm_classification VARCHAR(30),
  event_date TIMESTAMPTZ NOT NULL,
  reported_by INTEGER,
  location_unit VARCHAR(40),
  rca_initiated VARCHAR(5)
);
ALTER TABLE adm_adverse_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_adverse_events FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_ae_tenant_isolation ON adm_adverse_events;
CREATE POLICY adm_ae_tenant_isolation ON adm_adverse_events
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS adm_rca_log (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  rca_id VARCHAR(50) UNIQUE NOT NULL,
  event_id VARCHAR(50),
  methodology VARCHAR(30),
  team_lead VARCHAR(60),
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  action_plan_summary TEXT
);
ALTER TABLE adm_rca_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_rca_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_rca_tenant_isolation ON adm_rca_log;
CREATE POLICY adm_rca_tenant_isolation ON adm_rca_log
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));