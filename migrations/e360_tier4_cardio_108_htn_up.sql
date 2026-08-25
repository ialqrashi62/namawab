-- e360 TIER4_CARDIO-108 HTN UP
CREATE TABLE IF NOT EXISTS cardio_htn_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  sbp INTEGER,
  dbp INTEGER,
  stage VARCHAR(30),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE cardio_htn_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_htn_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_hn_tenant_isolation ON cardio_htn_metrics;
CREATE POLICY cardio_hn_tenant_isolation ON cardio_htn_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));