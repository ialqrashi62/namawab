-- e349 TIER4_NEURO-105 Headache UP
CREATE TABLE IF NOT EXISTS neuro_headache_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  subtype VARCHAR(30),
  headache_days_per_month INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE neuro_headache_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_headache_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_hd_tenant_isolation ON neuro_headache_metrics;
CREATE POLICY neuro_hd_tenant_isolation ON neuro_headache_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));