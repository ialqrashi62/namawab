-- e334 TIER4_OBGYN-105 REI UP
CREATE TABLE IF NOT EXISTS obgyn_rei_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  age INTEGER,
  amh NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE obgyn_rei_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE obgyn_rei_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_re_tenant_isolation ON obgyn_rei_metrics;
CREATE POLICY obgyn_re_tenant_isolation ON obgyn_rei_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));