-- e308 TIER4_RARE-105 Amyloidosis UP
CREATE TABLE IF NOT EXISTS rare_amyloid_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  amyloid_type VARCHAR(20),
  cardiac_stage VARCHAR(10),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rare_amyloid_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_amyloid_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_am_tenant_isolation ON rare_amyloid_metrics;
CREATE POLICY rare_am_tenant_isolation ON rare_amyloid_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));