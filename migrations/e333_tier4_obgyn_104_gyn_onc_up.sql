-- e333 TIER4_OBGYN-104 GYN Onc UP
CREATE TABLE IF NOT EXISTS obgyn_gynonc_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  cancer_type VARCHAR(30),
  risk_level VARCHAR(20),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE obgyn_gynonc_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE obgyn_gynonc_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_gn_tenant_isolation ON obgyn_gynonc_metrics;
CREATE POLICY obgyn_gn_tenant_isolation ON obgyn_gynonc_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));