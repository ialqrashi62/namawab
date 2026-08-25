-- e359 TIER4_CARDIO-107 CardioOnc UP
CREATE TABLE IF NOT EXISTS cardio_onc_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  agent VARCHAR(30),
  baseline_lvef INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE cardio_onc_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_onc_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_oc_tenant_isolation ON cardio_onc_metrics;
CREATE POLICY cardio_oc_tenant_isolation ON cardio_onc_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));