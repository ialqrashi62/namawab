-- e290 TIER3_SUP-107 Hospital Security UP
CREATE TABLE IF NOT EXISTS sup_security_incidents (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  incident_id VARCHAR(50) UNIQUE NOT NULL,
  incident_type VARCHAR(40),
  severity VARCHAR(20),
  location_unit VARCHAR(40),
  incident_at TIMESTAMPTZ NOT NULL,
  reported_by INTEGER,
  law_enforcement_involved VARCHAR(5)
);
ALTER TABLE sup_security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE sup_security_incidents FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sup_si_tenant_isolation ON sup_security_incidents;
CREATE POLICY sup_si_tenant_isolation ON sup_security_incidents
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));