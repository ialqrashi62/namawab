-- e332 TIER4_OBGYN-103 MFM UP
CREATE TABLE IF NOT EXISTS obgyn_mfm_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  anomaly VARCHAR(30),
  efw_percentile NUMERIC(5,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE obgyn_mfm_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE obgyn_mfm_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_mfm_tenant_isolation ON obgyn_mfm_metrics;
CREATE POLICY obgyn_mfm_tenant_isolation ON obgyn_mfm_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));