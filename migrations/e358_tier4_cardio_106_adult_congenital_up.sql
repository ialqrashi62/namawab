-- e358 TIER4_CARDIO-106 ACHD UP
CREATE TABLE IF NOT EXISTS cardio_achd_metrics (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL DEFAULT 1,
  metric_id VARCHAR(50) UNIQUE NOT NULL,
  diagnosis VARCHAR(30),
  age INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE cardio_achd_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE cardio_achd_metrics FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS cardio_ah_tenant_isolation ON cardio_achd_metrics;
CREATE POLICY cardio_ah_tenant_isolation ON cardio_achd_metrics
  USING (tenant_id::text = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id::text = current_setting('app.tenant_id', true));