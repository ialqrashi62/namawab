-- e357 TIER4_CARDIO-105 PAD/Vascular UP
CREATE TABLE IF NOT EXISTS cardio_vascular_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  abi NUMERIC(4,2),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE cardio_vascular_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_vascular_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_vs_tenant_isolation ON cardio_vascular_metrics;
CREATE POLICY cardio_vs_tenant_isolation ON cardio_vascular_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));