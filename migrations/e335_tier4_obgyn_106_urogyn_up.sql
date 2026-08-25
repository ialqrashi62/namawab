-- e335 TIER4_OBGYN-106 Urogyn UP
CREATE TABLE IF NOT EXISTS obgyn_uro_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  stage INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE obgyn_uro_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE obgyn_uro_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_ug_tenant_isolation ON obgyn_uro_metrics;
CREATE POLICY obgyn_ug_tenant_isolation ON obgyn_uro_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));