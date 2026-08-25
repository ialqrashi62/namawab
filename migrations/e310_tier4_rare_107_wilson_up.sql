-- e310 TIER4_RARE-107 Wilson UP
CREATE TABLE IF NOT EXISTS rare_wilson_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  leipzig_score INTEGER,
  diagnosis VARCHAR(20),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rare_wilson_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_wilson_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_wm_tenant_isolation ON rare_wilson_metrics;
CREATE POLICY rare_wm_tenant_isolation ON rare_wilson_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));