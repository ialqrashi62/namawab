-- e330 TIER4_OBGYN-101 OB High Risk UP
CREATE TABLE IF NOT EXISTS obgyn_obhighrisk_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(40),
  ga_weeks NUMERIC(4,1),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE obgyn_obhighrisk_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE obgyn_obhighrisk_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_oh_tenant_isolation ON obgyn_obhighrisk_metrics;
CREATE POLICY obgyn_oh_tenant_isolation ON obgyn_obhighrisk_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));