-- e269 TIER3_ADM-105 Patient Flow / Throughput UP
CREATE TABLE IF NOT EXISTS adm_flow_dashboard (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  snapshot_id VARCHAR(50) UNIQUE NOT NULL,
  snapshot_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ed_arrivals_today INTEGER,
  ed_boarding_count INTEGER,
  hospital_occupancy_pct NUMERIC(5,2),
  available_icu_beds INTEGER,
  discharge_before_noon_pct NUMERIC(5,2)
);
ALTER TABLE adm_flow_dashboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_flow_dashboard FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_fd_tenant_isolation ON adm_flow_dashboard;
CREATE POLICY adm_fd_tenant_isolation ON adm_flow_dashboard
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));

CREATE TABLE IF NOT EXISTS adm_command_center_log (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  activation_id VARCHAR(50) UNIQUE NOT NULL,
  activation_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deactivation_time TIMESTAMPTZ,
  reason TEXT,
  incident_commander VARCHAR(60),
  operations_chief VARCHAR(60)
);
ALTER TABLE adm_command_center_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE adm_command_center_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS adm_cc_tenant_isolation ON adm_command_center_log;
CREATE POLICY adm_cc_tenant_isolation ON adm_command_center_log
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));