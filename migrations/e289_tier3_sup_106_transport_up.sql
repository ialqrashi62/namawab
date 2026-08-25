-- e289 TIER3_SUP-106 Patient Transport UP
CREATE TABLE IF NOT EXISTS sup_transport_log (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  transport_id VARCHAR(50) UNIQUE NOT NULL,
  patient_id INTEGER NOT NULL,
  from_unit VARCHAR(40),
  to_unit VARCHAR(40),
  transport_team VARCHAR(30),
  transport_time_min INTEGER,
  delay_min INTEGER,
  transport_start TIMESTAMPTZ NOT NULL,
  transport_end TIMESTAMPTZ
);
ALTER TABLE sup_transport_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_transport_log FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_tr_tenant_isolation ON sup_transport_log;
CREATE POLICY sup_tr_tenant_isolation ON sup_transport_log
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));