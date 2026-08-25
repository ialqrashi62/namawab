-- e347 TIER4_NEURO-103 MS UP
CREATE TABLE IF NOT EXISTS neuro_ms_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  subtype VARCHAR(20),
  edss NUMERIC(4,1),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE neuro_ms_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuro_ms_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS neuro_ms_tenant_isolation ON neuro_ms_metrics;
CREATE POLICY neuro_ms_tenant_isolation ON neuro_ms_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));