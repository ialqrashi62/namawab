-- e354 TIER4_CARDIO-102 Arrhythmia UP
CREATE TABLE IF NOT EXISTS cardio_ep_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  arrhythmia_type VARCHAR(30),
  cha2ds2vasc INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE cardio_ep_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_ep_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_ce_tenant_isolation ON cardio_ep_metrics;
CREATE POLICY cardio_ce_tenant_isolation ON cardio_ep_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));