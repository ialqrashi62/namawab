-- e337 TIER4_OBGYN-108 MIGS UP
CREATE TABLE IF NOT EXISTS obgyn_migs_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  fibroid_size_cm NUMERIC(5,1),
  location VARCHAR(30),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE obgyn_migs_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE obgyn_migs_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS obgyn_ms_tenant_isolation ON obgyn_migs_metrics;
CREATE POLICY obgyn_ms_tenant_isolation ON obgyn_migs_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));