-- e294 TIER3_ANES-102 Procedural Sedation UP
CREATE TABLE IF NOT EXISTS anes_sedation_log (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  sedation_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  procedure_type VARCHAR(60),
  deepest_level VARCHAR(30),
  agent VARCHAR(60),
  duration_min INTEGER,
  reversal_agents VARCHAR(60),
  complications VARCHAR(40),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE anes_sedation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE anes_sedation_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS anes_sl_tenant_isolation ON anes_sedation_log;
CREATE POLICY anes_sl_tenant_isolation ON anes_sedation_log
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));