-- e312 TIER4_RARE-109 EDS UP
CREATE TABLE IF NOT EXISTS rare_eds_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  beighton_score INTEGER,
  suspected_type VARCHAR(15),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE rare_eds_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rare_eds_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rare_em_tenant_isolation ON rare_eds_metrics;
CREATE POLICY rare_em_tenant_isolation ON rare_eds_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));